class Player
    name = ""
    pass = ""
    dlvl = 0
    xp = 0
    sessionID = ""
    x: -1
    y: -1

    constructor: (@name, @pass, @dlvl, @xp, @x, @y, @sessionID) ->

    getLevel: () =>
        @dlvl

    getName: () =>
        @name

    getXP: () ->
        @xp

module.exports = Player