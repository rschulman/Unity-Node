app = require 'express'.createServer()
parseCookie = require 'connect'.utils.parseCookie
gameState = require './gameState'
Level = require './level'
Player = require './player'
Db = require 'mongodb'.Db
Connection = require 'mongodb'.Connection
dbServer = require 'mongodb'.Server

clientFiles = new static.Server()
levels = new Level false
ourState = new gameState levels

playerCollection = {}

db = new Db('unityrl', new dbServer(localhost, Connection.DEFAULT_PORT, {}), {native_parser: true});
db.open (err, db_object) ->
    if err
        console.log err
    else
        console.log "Connected to db server."
        playerCollection = new mongodb.Collection db_object, 'players' 

app.use express.cookieParser()
app.use express.session()
app.use express.bodyParser()

app.get '/', (req, res) ->
    res.render 'index.jade', {title: 'UnityRL'}

app.get '/play', (req, res) ->
    # Check to see if logged in, if so take them to play, else redirect back to /
    playerCollection.count {session: req.sessionID}, (err, result) ->
        if not err and result == 1
            res.render 'play.jade', {title: 'UnityRL'}
        else
            res.flash 'info', "Please log in before trying to play."
            res.render '/'

app.get '/login', (req, res) ->
    # Check the password against the DB, set cookie if valid, else redirect with failed login.
    loggedin = false
    username = req.param 'name'
    pass = req.param 'pass'
    playerCollection.find {name: username}, (err, cursor) ->
        if cursor.count == 1
            cursor.nextObject (err, player) ->
                if player.password = pass
                    loggedin = true
                    playerCollection.update {name: username}, {$set: {session: req.sessionID}}
                    res.render '/'
                else
                    req.flash 'info', "Login failed, please try again."
                    res.render '/'
        else
            req.flash 'info', "Login failed, please try again."
            res.render '/'

app.listen(8000) 

io = require('socket.io').listen app
io.set 'log level', 2
io.set 'close timeout', 60*60*24
io.set 'authorization', (data, accept) ->
    if data.headers.cookie
        data.cookie = parseCookie data.headers.cookie
        data.sessionID = data.cookie['express.sid']
    else
        return accept 'No cookie.', false
    accept null, true



io.sockets.on 'connection', (socket) ->
    playerCollection.find {session: socket.handshake.sessionID}, (err, cursor) ->
        # If this socket is associated with a session ...
        unless err
            cursor.nextObject (err, dbplayer) ->
                ourState.addPlayer socket.id dbplayer
                ourState.getLevel(dbplayer.dlvl).addPlayer socket.id dbplayer
                client.emit 'update', ourState.getLevel(dbplayer.dlvl).povObject(id) for id, client of io.sockets.sockets
                socket.join dbplayer.dlvl

    socket.on 'level chat', (message) ->
        player = ourState.getPlayer(socket.id)
        level = player.getLevel()
        io.sockets.in(level).emit 'level chat', player.name + ": " + message
        true

    socket.on 'send map', (message) ->
        where = ourState.getPlayer(socket.id).level
        socket.emit 'update', ourState.getLevel(where).povObject()
        true

    socket.on 'move', (message) ->
        where = ourState.getPlayer(socket.id).level
        ourState.getLevel(where).movePlayer(socket.id, message.split " ")
        client.emit 'update', ourState.getLevel(where).povObject(id) for id, client of io.sockets.sockets
        true
    true