(function() {
  var Player,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Player = (function() {

    Player.prototype.name = "";

    Player.prototype.pass = "";

    Player.prototype.dlvl = 0;

    Player.prototype.xp = 0;

    Player.prototype.sessionID = "";

    Player.prototype.x = -1;

    Player.prototype.y = -1;

    Player.prototype.str = 0;

    Player.prototype.dex = 0;

    Player.prototype.int = 0;

    Player.prototype.con = 0;

    Player.prototype.maxHP = 0;

    function Player(name, pass, dlvl, xp, x, y, sessionID, str, dex, int, con, maxHP) {
      this.name = name;
      this.pass = pass;
      this.dlvl = dlvl;
      this.xp = xp;
      this.x = x;
      this.y = y;
      this.sessionID = sessionID;
      this.str = str;
      this.dex = dex;
      this.int = int;
      this.con = con;
      this.maxHP = maxHP;
      this.getName = __bind(this.getName, this);
      this.getLevel = __bind(this.getLevel, this);
      if (this.maxHP === 0) this.maxHP = 15;
    }

    Player.prototype.getXPLevel = function() {
      var levels, targetlevel, targetxp, _len;
      levels = [0, 100, 300, 550, 900, 1300, 1800, 2500, 3200, 4500];
      if (this.xp === 0) return 1;
      for (targetlevel = 0, _len = levels.length; targetlevel < _len; targetlevel++) {
        targetxp = levels[targetlevel];
        if (targetxp >= this.xp) return targetlevel;
      }
    };

    Player.prototype.getLevel = function() {
      return this.dlvl;
    };

    Player.prototype.setDlvl = function(newlevel) {
      return this.dlvl = newlevel;
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
