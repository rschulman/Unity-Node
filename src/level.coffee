class Level
    data = []
    data[x] = [] for x in [0..19]
    players = {}
    
    constructor: (is_town) ->
        if is_town
            data[row][col] = "." for row in [0..19] for col in [0..79]

    addPlayer: (id, player) ->
	    players[id] = player
        
    toString: () ->
        tempCopy = []
        tempCopy.push row[0...row.length] for row in data
        for id, player of players
            whereishe = player.getPos()
            tempCopy[whereishe[1]][whereishe[0]] = "@"
        map = "--------------------------------------------------------------------------------\n"
        map += "|" + row.join("") + "|\n" for row in tempCopy
        map += "--------------------------------------------------------------------------------"
        map

module.exports = Level