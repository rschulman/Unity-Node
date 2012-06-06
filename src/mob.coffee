fs = require 'fs'

class Mob
    mobtype: ""
    character: ""
    hp: 0
    AC: 0

    constructor: (@mobtype, callback) ->
        fs.readFile "mobs/" + mobtype + ".json", "utf8", (err, data, assignVars) => 
            if err
                callback err
            else
                mobject = JSON.parse data
                @hp = mobject.mob.hp    
                @AC = mobject.mob.AC
                @character = mobject.mob.character
                callback(this)

    nextMove: ->
        

module.exports = Mob