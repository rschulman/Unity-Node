class Player
    x = 40
    y = 10
    constructor: (@name, @level) ->

    getPos: () ->
       [x, y]

module.exports = Player