class Level
    data = []
    players = {}
    
    constructor: (is_town) ->
        if is_town
            data[row][col] = "." for row in [0..20] for col in [0..80]
        true
        
    toString: () ->
        tempCopy = []
        tempCopy[row] = data[row][0..data[row].length] for row in data
        for id, player of players
            tempCopy[player.y][player.x] = "@"
        map = "--------------------------------------------------------------------------------\n"
        map += "|" + row.join("") + "|\n" for row in tempCopy
        map += "--------------------------------------------------------------------------------"
        map

exports.Level = Level