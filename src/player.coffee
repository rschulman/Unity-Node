class Player
    name = ""
    level = 0
    x: 40
    y: 10
    constructor: (@name, @level) ->

    getPos: () =>
       [@x, @y]

    getLevel: () =>
	   @level

    move: (vector) =>
       @x += parseInt(vector[0]) if @x + parseInt(vector[0]) >= 0 and @x + parseInt(vector[0]) <= 79
       @y += parseInt(vector[1]) if @y + parseInt(vector[1]) >= 0 and @y + parseInt(vector[1]) <= 19
       true

module.exports = Player