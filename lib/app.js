(function() {
  var Level, Player, clientFiles, gameState, http, io, levels, ourState, server, static;

  http = require('http');

  static = require('node-static');

  gameState = require('./gameState');

  Level = require('./level');

  Player = require('./player');

  clientFiles = new static.Server();

  levels = new Level(false);

  ourState = new gameState(levels);

  server = http.createServer(function(req, res) {
    return req.addListener('end', function() {
      return clientFiles.serve(req, res);
    });
  });

  io = require('socket.io').listen(server);

  io.set('log level', 2);

  io.set('close timeout', 60 * 60 * 24);

  server.listen(8000);

  io.sockets.on('connection', function(socket) {
    socket.on('new user', function(message) {
      var client, id, newGuy, _ref;
      newGuy = new Player(message, 0);
      ourState.addPlayer(socket.id, newGuy);
      ourState.getLevel(0).addPlayer(socket.id, newGuy);
      _ref = io.sockets.sockets;
      for (id in _ref) {
        client = _ref[id];
        client.emit('update', ourState.getLevel(0).povObject(id));
      }
      socket.join(0);
      return true;
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
    return true;
  });

}).call(this);
