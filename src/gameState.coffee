Level = require './level'

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
        if levels[dlvl]?
            levels[dlvl]
        else
            false

    addLevel: (dlvl, level) ->
        levels[dlvl] = level

    playerLogOut: (id) ->
        delete players[id]
    
    playerLevelMove: (id, direction, levelCollection, callback) ->
        mover = players[id]
        where = mover.getLevel()
        console.log mover.name + " moving from " + where + ", " + direction
        newwhere = 0
        ascending = false
        if levels[where].canLeave id, direction
            if direction == "up"
                newwhere = where - 1
                ascending = true
            else
                newwhere = where + 1
            if levels[newwhere]?
                console.log "New level in memory."
                levels[newwhere].addPlayer id, mover, {comingup: ascending, stairs: true}
                mover.setDlvl(newwhere)
                callback where, newwhere
            else
                console.log "New level NOT in memory."
                levelCollection.find {dlvl: newwhere}, (err, cursor) ->
                    cursor.count (err, number) ->
                        if number == 1
                            console.log "Level exists in DB"
                            cursor.nextObject (err, loadlevel) ->
                                levels[newwhere] = new Level {generate: false}, loadlevel
                                console.log "Loaded level " + newwhere + " from db"
                        else
                            console.log "Generating new level."
                            levels[newwhere] = new Level {generate: true, type: "dungeon"}, []
                            levels[newwhere].save(levelCollection, newwhere)
                        true
                        levels[newwhere].addPlayer id, mover, {comingup: ascending, stairs: true}
                        mover.setDlvl(newwhere)
                        callback where, newwhere
                    true
        true


module.exports = gameState