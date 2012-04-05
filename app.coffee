express = require 'express'
gameState = require './lib/gameState'
Level = require './lib/level'
Player = require './lib/player'
mongodb = require 'mongodb'
connect = require 'express/node_modules/connect'

app = express.createServer()

playerCollection = {}
levelCollection = {}
ourState = {}

db = new mongodb.Db('unityrl', new mongodb.Server('127.0.0.1', mongodb.Connection.DEFAULT_PORT, {}), {native_parser: false});
db.open (err, db_object) ->
    if err
        console.log err
        false
    else
        console.log "Connected to db server."
        playerCollection = new mongodb.Collection db_object, 'players' 
        levelCollection = new mongodb.Collection db_object, 'levels'
        levelCollection.find {dlvl: 0}, (err, cursor) ->
            cursor.count (err, number) ->
                if number == 1
                    cursor.nextObject (err, loadlevel) ->
                        levelobject = new Level {generate: false}, loadlevel
                        console.log "Loaded level 0 from db"
                        ourState = new gameState levelobject, 0
                else
                    levelobject = new Level {generate: true, type: "dungeon"}, []
                    levelobject.save(levelCollection, 0)
                    ourState = new gameState levelobject, 0
        true

app.use express.cookieParser()
app.use express.session({secret: "roguelike", key: 'express.sid'})
app.use express.bodyParser()
app.use express.logger()
app.use '/public', express.static(__dirname + '/public')

app.get '/', (req, res) ->
    playerCollection.find {sessionID: req.sessionID}, (err, cursor) ->
       cursor.count (err, number) ->
            if number == 1
                console.log "Found a logged in player."
                cursor.nextObject (err, loggedplayer) ->
                    console.log loggedplayer
                    res.render 'index.jade', {layout: false, locals: {player: loggedplayer}}
            else
                res.render 'index.jade', {layout: false}
    false

app.get '/play', (req, res) ->
    # Check to see if logged in, if so take them to play, else redirect back to /
    playerCollection.count {sessionID: req.sessionID}, (err, result) ->
        if not err and result == 1
            res.render 'play.jade', {layout: false}
        else
            req.flash 'info', "Please log in before trying to play."
            res.render 'index.jade', {layout: false}

app.post '/login', (req, res) ->
    # Check the password against the DB, set cookie if valid, else redirect with failed login.
    loggedin = false
    username = req.body.name
    pass = req.body.pass
    console.log "Trying to log in " + username + "/" + pass
    playerCollection.find {name: username}, (err, cursor) ->
        cursor.count (err, number) ->
            if number == 1
                cursor.nextObject (err, player) ->
                    if player.pass == pass
                        loggedin = true
                        console.log "Logged in " + username
                        playerCollection.update {name: username}, {$set: {sessionID: req.sessionID}}
                        res.render 'index.jade', {layout: false, locals: {player: player}}
                    else
                        req.flash 'info', "Login failed, please try again."
                        res.render 'index.jade', {layout: false}
            else
                console.log "No such user: " + username
                req.flash 'info', "Login failed, please try again."
                res.render 'index.jade', {layout: false}

app.get '/create', (req, res) ->
    # Serve the create jade file.
    res.render 'create.jade', {layout: false}

app.post '/new', (req, res) ->
    # See if that username already exists. If not, create a new player and add to db.
    username = req.body.name
    pass = req.body.pass
    console.log "Creating a new character named " + username
    playerCollection.count {name: username}, (err, result) ->
        if result == 0 # No such name in db, make a new character, insert it, and log in user.
            victim = new Player username, pass, 0, 0, -1, -1, req.sessionID
            playerCollection.insert victim
            res.render 'index.jade', {layout: false}
        else
            req.flash 'info', 'That character name is taken, please try another.'
            res.render 'index.jade', {layout: false}

app.listen(8000) 

parseCookie = connect.utils.parseCookie

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
    playerCollection.find {sessionID: socket.handshake.sessionID}, (err, cursor) ->
        # If this socket is associated with a session ...
        unless err
            cursor.nextObject (err, dbplayer) ->
                dbplayer.x ?= -1
                dbplayer.y ?= -1
                inserting = new Player dbplayer.name, dbplayer.pass, dbplayer.dlvl, dbplayer.xp, dbplayer.x, dbplayer.y, dbplayer.sessionID
                ourState.addPlayer socket.id, inserting
                ourState.getLevel(inserting.getLevel()).addPlayer socket.id, inserting, {stairs: false}
                socket.join inserting.getLevel()
                ourState.getLevel(inserting.getLevel()).povObject(io.sockets)

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
        where = ourState.getPlayer(socket.id).getLevel()
        ourState.getLevel(where).movePlayer(socket.id, message.split " ")
        ourState.getLevel(where).povObject(io.sockets)
        true

    socket.on 'levelchange', (message) ->
        ourState.playerLevelMove socket.id, message, levelCollection, (where, newwhere) ->
            ourState.getLevel(where).povObject(io.sockets)
            ourState.getLevel(newwhere).povObject(io.sockets)

    socket.on 'disconnect', () ->
        departing = ourState.getPlayer(socket.id)
        updatehash = 
            dlvl: departing.getLevel()
            xp: departing.getXP()
            x: departing.x
            y: departing.y
            inventory: departing.inventory
        console.log updatehash
        playerCollection.update {name: departing.getName()}, {$set: updatehash}, {safe: true}, (err) ->
            if err
                console.log err
            else
                console.log "Saved player: " + departing.getName()
        ourState.getLevel(departing.getLevel()).playerLogOut socket.id
        ourState.playerLogOut socket.id
        #client.emit 'update', ourState.getLevel(departing.getLevel()).povObject(id) for id, client of io.sockets.sockets when id isnt socket.id
        true
    
    true