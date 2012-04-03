(function() {
  var Level, Player, app, connect, db, express, gameState, io, levels, mongodb, ourState, parseCookie, playerCollection;

  express = require('express');

  gameState = require('./lib/gameState');

  Level = require('./lib/level');

  Player = require('./lib/player');

  mongodb = require('mongodb');

  connect = require('express/node_modules/connect');

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
    secret: "roguelike",
    key: 'express.sid'
  }));

  app.use(express.bodyParser());

  app.use(express.logger());

  app.use('/public', express.static(__dirname + '/public'));

  app.get('/', function(req, res) {
    playerCollection.find({
      sessionID: req.sessionID
    }, function(err, cursor) {
      return cursor.count(function(err, number) {
        if (number === 1) {
          console.log("Found a logged in player.");
          return cursor.nextObject(function(err, loggedplayer) {
            console.log(loggedplayer);
            return res.render('index.jade', {
              layout: false,
              locals: {
                player: loggedplayer
              }
            });
          });
        } else {
          return res.render('index.jade', {
            layout: false
          });
        }
      });
    });
    return false;
  });

  app.get('/play', function(req, res) {
    return playerCollection.count({
      sessionID: req.sessionID
    }, function(err, result) {
      if (!err && result === 1) {
        return res.render('play.jade', {
          layout: false
        });
      } else {
        req.flash('info', "Please log in before trying to play.");
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
    console.log("Trying to log in " + username + "/" + pass);
    return playerCollection.find({
      name: username
    }, function(err, cursor) {
      return cursor.count(function(err, number) {
        if (number === 1) {
          return cursor.nextObject(function(err, player) {
            if (player.pass === pass) {
              loggedin = true;
              console.log("Logged in " + username);
              playerCollection.update({
                name: username
              }, {
                $set: {
                  sessionID: req.sessionID
                }
              });
              return res.render('index.jade', {
                layout: false,
                locals: {
                  player: player
                }
              });
            } else {
              req.flash('info', "Login failed, please try again.");
              return res.render('index.jade', {
                layout: false
              });
            }
          });
        } else {
          console.log("No such user: " + username);
          req.flash('info', "Login failed, please try again.");
          return res.render('index.jade', {
            layout: false
          });
        }
      });
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
    pass = req.body.pass;
    console.log("Creating a new character named " + username);
    return playerCollection.count({
      name: username
    }, function(err, result) {
      var victim;
      if (result === 0) {
        victim = new Player(username, pass, 0, 0, -1, -1, req.sessionID);
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

  parseCookie = connect.utils.parseCookie;

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
      sessionID: socket.handshake.sessionID
    }, function(err, cursor) {
      if (!err) {
        return cursor.nextObject(function(err, dbplayer) {
          var client, id, inserting, _ref, _results;
          if (dbplayer.x == null) dbplayer.x = -1;
          if (dbplayer.y == null) dbplayer.y = -1;
          inserting = new Player(dbplayer.name, dbplayer.pass, dbplayer.dlvl, dbplayer.xp, dbplayer.x, dbplayer.y, dbplayer.sessionID);
          ourState.addPlayer(socket.id, inserting);
          ourState.getLevel(inserting.getLevel()).addPlayer(socket.id, inserting);
          _ref = io.sockets.sockets;
          _results = [];
          for (id in _ref) {
            client = _ref[id];
            _results.push(client.emit('update', ourState.getLevel(inserting.getLevel()).povObject(id)));
          }
          return _results;
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
      where = ourState.getPlayer(socket.id).getLevel();
      ourState.getLevel(where).movePlayer(socket.id, message.split(" "));
      _ref = io.sockets.sockets;
      for (id in _ref) {
        client = _ref[id];
        client.emit('update', ourState.getLevel(where).povObject(id));
      }
      return true;
    });
    socket.on('disconnect', function() {
      var client, departing, id, updatehash, _ref;
      departing = ourState.getPlayer(socket.id);
      updatehash = {
        dlvl: departing.getLevel(),
        xp: departing.getXP(),
        x: departing.x,
        y: departing.y,
        inventory: departing.inventory
      };
      console.log(updatehash);
      playerCollection.update({
        name: departing.getName()
      }, {
        $set: updatehash
      }, {
        safe: true
      }, function(err) {
        if (err) {
          return console.log(err);
        } else {
          return console.log("Saved player: " + departing.getName());
        }
      });
      ourState.getLevel(departing.getLevel()).playerLogOut(socket.id);
      ourState.playerLogOut(socket.id);
      _ref = io.sockets.sockets;
      for (id in _ref) {
        client = _ref[id];
        if (id !== socket.id) {
          client.emit('update', ourState.getLevel(departing.getLevel()).povObject(id));
        }
      }
      return true;
    });
    return true;
  });

}).call(this);
