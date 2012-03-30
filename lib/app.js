(function() {
  var Level, Player, app, db, express, gameState, io, levels, mongodb, ourState, playerCollection;

  express = require('express');

  gameState = require('./gameState');

  Level = require('./level');

  Player = require('./player');

  mongodb = require('mongodb');

  app = express.createServer();

  levels = new Level(false);

  ourState = new gameState(levels);

  playerCollection = {};

  db = new mongodb.Db('unityrl', new mongodb.Server('127.0.0.1', mongodb.Connection.DEFAULT_PORT, {}), {
    native_parser: false
  });

  db.open(function(err, db_object) {
    if (err) {
      return console.log(err);
    } else {
      console.log("Connected to db server.");
      return playerCollection = new mongodb.Collection(db_object, 'players');
    }
  });

  app.use(express.cookieParser());

  app.use(express.session({
    secret: "roguelike"
  }));

  app.use(express.bodyParser());

  app.get('/', function(req, res) {
    playerCollection.find({
      sessionID: req.sessionID
    }, function(err, cursor) {
      if (cursor.count === 1) {
        return cursor.nextObject(function(err, player) {
          return res.render('index.jade', {
            layout: false,
            player: player
          });
        });
      } else {
        return res.render('index.jade', {
          layout: false
        });
      }
    });
    return false;
  });

  app.get('/play', function(req, res) {
    return playerCollection.count({
      session: req.sessionID
    }, function(err, result) {
      if (!err && result === 1) {
        return res.render('play.jade', {
          layout: false
        });
      } else {
        res.flash('info', "Please log in before trying to play.");
        return res.render('index.jade', {
          layout: false
        });
      }
    });
  });

  app.post('/login', function(req, res) {
    var loggedin, pass, username;
    loggedin = false;
    username = req.body.name;
    pass = req.body.pass;
    return playerCollection.find({
      name: username
    }, function(err, cursor) {
      if (cursor.count === 1) {
        return cursor.nextObject(function(err, player) {
          if (player.password = pass) {
            loggedin = true;
            playerCollection.update({
              name: username
            }, {
              $set: {
                session: req.sessionID
              }
            });
            return res.render('index.jade', {
              layout: false,
              player: player
            });
          } else {
            req.flash('info', "Login failed, please try again.");
            return res.render('index.jade', {
              layout: false
            });
          }
        });
      } else {
        req.flash('info', "Login failed, please try again.");
        return res.render('index.jade', {
          layout: false
        });
      }
    });
  });

  app.get('/create', function(req, res) {
    return res.render('create.jade', {
      layout: false
    });
  });

  app.post('/new', function(req, res) {
    var pass, username;
    username = req.body.name;
    pass = req.param('pass');
    console.log("Creating a new character named " + username);
    return playerCollection.count({
      name: username
    }, function(err, result) {
      var victim;
      if (result === 0) {
        victim = new Player(username, pass, req.sessionID);
        console.log(victim);
        playerCollection.insert(victim);
        return res.render('index.jade', {
          layout: false
        });
      } else {
        req.flash('info', 'That character name is taken, please try another.');
        return res.render('index.jade', {
          layout: false
        });
      }
    });
  });

  app.listen(8000);

  io = require('socket.io').listen(app);

  io.set('log level', 2);

  io.set('close timeout', 60 * 60 * 24);

  io.set('authorization', function(data, accept) {
    if (data.headers.cookie) {
      data.cookie = parseCookie(data.headers.cookie);
      data.sessionID = data.cookie['express.sid'];
    } else {
      return accept('No cookie.', false);
    }
    return accept(null, true);
  });

  io.sockets.on('connection', function(socket) {
    playerCollection.find({
      session: socket.handshake.sessionID
    }, function(err, cursor) {
      if (!err) {
        return cursor.nextObject(function(err, dbplayer) {
          var client, id, _ref;
          ourState.addPlayer(socket.id(dbplayer));
          ourState.getLevel(dbplayer.getLevel()).addPlayer(socket.id(dbplayer));
          _ref = io.sockets.sockets;
          for (id in _ref) {
            client = _ref[id];
            client.emit('update', ourState.getLevel(dbplayer.dlvl).povObject(id));
          }
          return socket.join(dbplayer.dlvl);
        });
      }
    });
    socket.on('level chat', function(message) {
      var level, player;
      player = ourState.getPlayer(socket.id);
      level = player.getLevel();
      io.sockets["in"](level).emit('level chat', player.name + ": " + message);
      return true;
    });
    socket.on('send map', function(message) {
      var where;
      where = ourState.getPlayer(socket.id).level;
      socket.emit('update', ourState.getLevel(where).povObject());
      return true;
    });
    socket.on('move', function(message) {
      var client, id, where, _ref;
      where = ourState.getPlayer(socket.id).level;
      ourState.getLevel(where).movePlayer(socket.id, message.split(" "));
      _ref = io.sockets.sockets;
      for (id in _ref) {
        client = _ref[id];
        client.emit('update', ourState.getLevel(where).povObject(id));
      }
      return true;
    });
    socket.on('disconnect', function() {
      var departing, updatehash;
      departing = ourState.getPlayer(socket.id);
      updatehash = {
        dlvl: departing.getDlvl(),
        xp: departing.getXP(),
        x: departing.x,
        y: departing.y,
        inventory: departing.inventory
      };
      playerCollection.update({
        session: socket.handshake.sessionID
      }, {
        $set: updatehash
      }, function(err) {
        if (err) return console.log(err);
      });
      return true;
    });
    return true;
  });

}).call(this);
