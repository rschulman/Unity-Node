var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , static = require('node-static');

app.listen(process.env.PORT);

var clientFiles = new static.Server();

function handler (req, res) {
    req.addListener('end', function () {
        clientFiles.serve(req, res);
    });
}

function Player (name) {
    this.playerName = name;
}

console.log('Server running!');

var constructMap = function() {
    var map = "--------------------------------------------------------------------------------\n";
    for (var row = 1; row < 21; row++) {
        for (var col = 1; col < 81; col++) {
            if (col == 1 || col == 80) {
                map = map + "|";
            }
            else {
               map = map + "."; 
            }
        }
        map = map + "\n";
    }
    map = map + "--------------------------------------------------------------------------------";
    return map;
}

function GameState () {
    this.players = [];
    this.levels = new Array();
    
    this.makeMap = constructMap;
    this.levels.push(this.makeMap());
}

var ourGame = new GameState();

io.sockets.on('connection', function(client) {
    
    client.on('new user', function(message) {
        ourGame.players.push(new Player(message));
        client.set('playername', message);
    });
    
    client.on('message', function(message) {
            var userName;
            client.get('playername', function (err, name) {
                userName = name;
            });
            var broadcastMessage = userName + ': ' + message;
            client.broadcast.emit('message', broadcastMessage);
            client.emit('message', broadcastMessage);
    });
    
    client.on('send map', function (message) {
        client.emit('map', ourGame.levels[0]);
    });

    client.on('disconnect', function() {
        var broadcastMessage = userName + ' has left the zone.';
        client.broadcast.emit('message', broadcastMessage);
        client.emit('message', broadcastMessage);
    });
});
