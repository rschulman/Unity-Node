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

    function Player(name, pass, sessionID) {
      this.name = name;
      this.pass = pass;
      this.sessionID = sessionID;
      this.getName = __bind(this.getName, this);
      this.getLevel = __bind(this.getLevel, this);
      this.dlvl = 0;
      this.xp = 0;
    }

    Player.prototype.getLevel = function() {
      return this.dlvl;
    };

    Player.prototype.getName = function() {
      return this.name;
    };

    return Player;

  })();

  module.exports = Player;

}).call(this);
