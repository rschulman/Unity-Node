http = require 'http'
static = require 'node-static'
gameState = require './gameState'
Level = require './level'
Player = require './player'

clientFiles = new static.Server()
levels = new Level true
ourState = new gameState levels

server = http.createServer (req, res) ->
    req.addListener 'end', ->
        clientFiles.serve req, res

io = require('socket.io').listen server

server.listen(8000)

io.sockets.on 'connection', (socket) ->
    
    socket.on 'new user', (message) ->
        # Going to have to figure out what to do with new users...
        newGuy = new Player message, 0
        ourState.addPlayer socket.id, newGuy
        ourState.getLevel(0).addPlayer socket.id, newGuy
        io.sockets.emit 'map', ourState.getLevel(0).povObject()
        socket.join 0
        true

    socket.on 'level chat', (message) ->
        player = ourState.getPlayer(socket.id)
        level = player.getLevel()
        io.sockets.in(level).emit 'level chat', player.name+ ": " + message
        true

    socket.on 'send map', (message) ->
        where = ourState.getPlayer(socket.id).level
        console.log JSON.stringify ourState.getLevel(where)
        socket.emit 'map', ourState.getLevel(where).povObject()
        true

    socket.on 'move', (message) ->
        where = ourState.getPlayer(socket.id).level
        ourState.getPlayer(socket.id).move(message.split " ")
        io.sockets.emit 'map', ourState.getLevel(where).povObject()
        true