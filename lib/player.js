(function() {
  var Player;

  Player = (function() {
    var x, y;

    x = 40;

    y = 10;

    function Player(name, level) {
      this.name = name;
      this.level = level;
    }

    Player.prototype.getPos = function() {
      return [x, y];
    };

    return Player;

  })();

  module.exports = Player;

}).call(this);
