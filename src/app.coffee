http = require 'http'
static = require 'node-static'
gameState = require './gameState'
Level = require './level'
Player = require './player'

clientFiles = new static.Server()
levels[0] = new Level(true)
ourState = new gameState(levels)

server = http.createServer (req, res) ->
    req.addListener 'end', ->
        clientFiles.serve (req, res)

io = require('socket.io').listen server

http.listen(process.env.PORT)

io.sockets.on 'connection', (socket) ->
    
    socket.on 'new user', (message) ->
        # Going to have to figure out what to do with new users...
    
    socket.on 'level chat', (message) ->
        userName = players.socket.id.name
        io.sockets.in(level).emit 'level chat', userName + message
    
    socket.on 'send map', (message) ->
        socket.emit 'map', 