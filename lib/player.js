(function() {
  var Player,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Player = (function() {
    var level, name;

    name = "";

    level = 0;

    function Player(name, level) {
      this.name = name;
      this.level = level;
      this.getName = __bind(this.getName, this);
      this.getLevel = __bind(this.getLevel, this);
    }

    Player.prototype.getLevel = function() {
      return this.level;
    };

    Player.prototype.getName = function() {
      return this.name;
    };

    return Player;

  })();

  module.exports = Player;

}).call(this);
