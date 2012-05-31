class Player
    name = ""
    pass = ""
    dlvl = 0
    xp = 0
    sessionID = ""
    x: -1
    y: -1
    str: 0
    dex: 0
    int: 0
    con: 0

    constructor: (@name, @pass, @dlvl, @xp, @x, @y, @sessionID, @str, @dex, @int, @con) ->
        level = @getXPLevel()
        # hp = 

    getXPLevel: () =>
        # Figure out how we want to determine XP level.
        # These numbers are really prelim. Gotta think about that more.
        # levels = {0: 1, 100: 2, 300: 3, 550: 4, 900: 5, 1300: 6, 1800: 7, 2500: 8, 3200: 9, 4500: 10}
        levels = [0, 100, 300, 550, 900, 1300, 1800, 2500, 3200, 4500]
        return targetlevel for targetxp, targetlevel in levels when targetxp >= xp

    getLevel: () =>
        @dlvl

    setDlvl: (newlevel) ->
        @dlvl = newlevel

    getName: () =>
        @name

    getXP: () ->
        @xp

module.exports = Player