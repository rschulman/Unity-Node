class Player
    name: ""
    pass: ""
    dlvl: 0
    xp: 0
    sessionID: ""
    x: -1
    y: -1
    str: 0
    dex: 0
    int: 0
    con: 0
    maxHP: 0

    constructor: (@name, @pass, @dlvl, @xp, @x, @y, @sessionID, @str, @dex, @int, @con, @maxHP) ->
        @maxHP = 15 if @maxHP == 0 # First level max HP for fighters. Have to implement other classes later.

    getXPLevel: () ->
        # Figure out how we want to determine XP level.
        # These numbers are really prelim. Gotta think about that more.
        levels = [0, 100, 300, 550, 900, 1300, 1800, 2500, 3200, 4500]
        return 1 if @xp == 0
        return targetlevel for targetxp, targetlevel in levels when targetxp >= @xp

    getLevel: () =>
        @dlvl

    setDlvl: (newlevel) ->
        @dlvl = newlevel

    getName: () =>
        @name

    getXP: () ->
        @xp

module.exports = Player