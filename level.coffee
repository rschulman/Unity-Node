class Level
    data = []
    players = {}
    
    constructor: (is_town) ->
        if is_town
            row for row in [0..20]
                col for col in [0..80]
                    data[row][col] = "."
        true
        
    toString: () ->
        tempCopy = []
        row for row in data
            tempCopy[row] = data[row][0..data[row].length]
        for id, player of players
            tempCopy[player.y][player.x] = "@"
        map = "--------------------------------------------------------------------------------\n"
        row for row in tempCopy
            map += "|"
            map += row.join("") + "|\n"
        map += "--------------------------------------------------------------------------------"
        map

exports.Level = Level