(function() {
  var Level, Player, clientFiles, gameState, http, io, levels, ourState, server, static;

  http = require('http');

  static = require('node-static');

  gameState = require('./gameState');

  Level = require('./level');

  Player = require('./player');

  clientFiles = new static.Server();

  levels = new Level(true);

  ourState = new gameState(levels);

  server = http.createServer(function(req, res) {
    return req.addListener('end', function() {
      return clientFiles.serve(req, res);
    });
  });

  io = require('socket.io').listen(server);

  server.listen(8080);

  io.sockets.on('connection', function(socket) {
    socket.on('new user', function(message) {
      var newGuy;
      newGuy = new Player(message, 0);
      ourState.addPlayer(socket.id, newGuy);
      ourState.getLevel(0).addPlayer(socket.id, newGuy);
      return true;
    });
    socket.on('level chat', function(message) {
      var userName;
      userName = ourState.players[socket.id].name;
      io.sockets["in"](level).emit('level chat', userName + message);
      return true;
    });
    return socket.on('send map', function(message) {
      var where;
      where = ourState.getPlayer(socket.id).level;
      socket.emit('map', ourState.getLevel(where).toString());
      return true;
    });
  });

}).call(this);
