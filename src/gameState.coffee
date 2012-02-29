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
		
module.exports = gameState