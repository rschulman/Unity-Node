(function() {
  var Player,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Player = (function() {
    var dlvl, name, pass, sessionID, xp;

    name = "";

    pass = "";

    dlvl = 0;

    xp = 0;

    sessionID = "";

    Player.prototype.x = -1;

    Player.prototype.y = -1;

    function Player(name, pass, dlvl, xp, x, y, sessionID) {
      this.name = name;
      this.pass = pass;
      this.dlvl = dlvl;
      this.xp = xp;
      this.x = x;
      this.y = y;
      this.sessionID = sessionID;
      this.getName = __bind(this.getName, this);
      this.getLevel = __bind(this.getLevel, this);
    }

    Player.prototype.getLevel = function() {
      return this.dlvl;
    };

    Player.prototype.getName = function() {
      return this.name;
    };

    Player.prototype.getXP = function() {
      return this.xp;
    };

    return Player;

  })();

  module.exports = Player;

}).call(this);
