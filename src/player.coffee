class Player
	name = ""
	level = 0

	constructor: (@name, @level) ->

	getLevel: () =>
		@level

	getName: () =>
		@name

module.exports = Player