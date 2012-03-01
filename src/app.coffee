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

server.listen(8080)

io.sockets.on 'connection', (socket) ->
    
    socket.on 'new user', (message) ->
        # Going to have to figure out what to do with new users...
        newGuy = new Player message, 0
        ourState.addPlayer socket.id, newGuy
        ourState.getLevel(0).addPlayer socket.id, newGuy
        io.sockets.emit 'map', ourState.getLevel(0).toString()
        true

    socket.on 'level chat', (message) ->
        userName = ourState.players[socket.id].name
        io.sockets.in(level).emit 'level chat', userName + message
        true

    socket.on 'send map', (message) ->
        where = ourState.getPlayer(socket.id).level
        socket.emit 'map', ourState.getLevel(where).toString()
        true

    socket.on 'move', (message) ->
        where = ourState.getPlayer(socket.id).level
        ourState.getPlayer(socket.id).move(message.split " ")
        io.sockets.emit 'map', ourState.getLevel(where).toString()
        true