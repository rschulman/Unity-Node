(function() {
  var gameState;

  gameState = (function() {
    var levels, players;

    players = {};

    levels = [];

    function gameState(levelobject, dlvl) {
      levels[dlvl] = levelobject;
    }

    gameState.prototype.addPlayer = function(id, player) {
      return players[id] = player;
    };

    gameState.prototype.getPlayer = function(id) {
      return players[id];
    };

    gameState.prototype.getLevel = function(dlvl) {
      return levels[dlvl];
    };

    gameState.prototype.playerLogOut = function(id) {
      return delete players[id];
    };

    return gameState;

  })();

  module.exports = gameState;

}).call(this);
