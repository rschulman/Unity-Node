class Player
    name = ""
    pass = ""
    dlvl = 0
    xp = 0
    sessionID = ""

    constructor: (@name, @pass, @sessionID) ->
        @dlvl = 0
        @xp = 0

    getLevel: () =>
        @dlvl

    getName: () =>
        @name

module.exports = Player