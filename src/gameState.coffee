class gameState
    players = {}
    levels = []
    
    constructor: (town) ->
        levels[0] = town

    addPlayer: (id, player) ->
        players[id] = player

    getPlayer: (id) ->
        players[id]

    getLevel: (dlvl) ->
        levels[dlvl]

    playerLogOut: (id) ->
        delete players[id]
    
    

module.exports = gameState