app = require 'express'.createServer()
gameState = require './gameState'
Level = require './level'
Player = require './player'
Db = require 'mongodb'.Db
Connection = require 'mongodb'.Connection
dbServer = require 'mongodb'.Server

clientFiles = new static.Server()
levels = new Level false
ourState = new gameState levels

db = new Db('unityrl', new dbServer(localhost, Connection.DEFAULT_PORT, {}), {native_parser: true});
db.open (err, db) ->
    if err
        console.log err
    else
        console.log "Connected to db server."

app.use express.cookieDecoder()
app.use express.session()

app.get '/', (req, res) ->
    res.render 'index.jade', {title: 'UnityRL'}

app.get '/play', (req, res) ->
    res.render 'play.jade', {title: 'UnityRL'}

    

io = require('socket.io').listen server
io.set('log level', 2)
io.set('close timeout', 60*60*24)

server.listen(8000)



io.sockets.on 'connection', (socket) ->
    
    socket.on 'new user', (message) ->
        # Going to have to figure out what to do with new users...
        db.find {name: message}, (err, cursor) ->
          if cursor.count = 1
            # Create a new player object from the db...
        
        
        newGuy = new Player message, 0
        ourState.addPlayer socket.id, newGuy
        ourState.getLevel(0).addPlayer socket.id, newGuy
        client.emit 'update', ourState.getLevel(0).povObject(id) for id, client of io.sockets.sockets
        socket.join 0
        true

    socket.on 'level chat', (message) ->
        player = ourState.getPlayer(socket.id)
        level = player.getLevel()
        io.sockets.in(level).emit 'level chat', player.name + ": " + message
        true

    socket.on 'send map', (message) ->
        where = ourState.getPlayer(socket.id).level
        console.log JSON.stringify ourState.getLevel(where)
        socket.emit 'update', ourState.getLevel(where).povObject()
        true

    socket.on 'move', (message) ->
        where = ourState.getPlayer(socket.id).level
        ourState.getLevel(where).movePlayer(socket.id, message.split " ")
        client.emit 'update', ourState.getLevel(where).povObject(id) for id, client of io.sockets.sockets
        true
    true