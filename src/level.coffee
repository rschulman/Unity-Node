class Level
    data = []
    data[x] = [] for x in [0..19]
    players = {}
    
    constructor: (is_town) ->
        if is_town
            data[row][col] = "." for row in [0..19] for col in [0..79]
    
    addPlayer: (id, player) ->
        players[id] = player
    
    toJSON: (id) ->
        # For now the only thing to return is the PCs and positions.
        elements = 
            pcs: {}
        elements.pcs[player.getName()] = player.getPos() for id, player of players
        JSON.stringify(elements)
    
    povObject: (id) ->
        elements = 
            pcs: {}
        elements.pcs[player.getName()] = player.getPos() for id, player of players
        elements
    
    computeFOV: (loc1, loc2) ->
        #  ToDo: Implement ray FOV solution
        true
    

module.exports = Level