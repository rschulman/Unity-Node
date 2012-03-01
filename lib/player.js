(function() {
  var Player,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Player = (function() {
    var level, name;

    name = "";

    level = {};

    Player.prototype.x = 40;

    Player.prototype.y = 10;

    function Player(name, level) {
      this.name = name;
      this.level = level;
      this.move = __bind(this.move, this);
      this.getPos = __bind(this.getPos, this);
    }

    Player.prototype.getPos = function() {
      return [this.x, this.y];
    };

    Player.prototype.move = function(vector) {
      if (this.x + parseInt(vector[0]) >= 0 && this.x + parseInt(vector[0]) <= 79) {
        this.x += parseInt(vector[0]);
      }
      if (this.y + parseInt(vector[1]) >= 0 && this.y + parseInt(vector[1]) <= 19) {
        this.y += parseInt(vector[1]);
      }
      return true;
    };

    return Player;

  })();

  module.exports = Player;

}).call(this);
