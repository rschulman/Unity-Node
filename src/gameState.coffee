class gameState
    players = {}
    levels = []
    
    constructor: (levelobject, dlvl) ->
        levels[dlvl] = levelobject

    addPlayer: (id, player) ->
        players[id] = player

    getPlayer: (id) ->
        players[id]

    getLevel: (dlvl) ->
        levels[dlvl]

    playerLogOut: (id) ->
        delete players[id]
    
    

module.exports = gameState