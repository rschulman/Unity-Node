(function() {
  var Level;

  Level = (function() {
    var data, players, x;

    data = [];

    for (x = 0; x <= 19; x++) {
      data[x] = [];
    }

    players = {};

    function Level(is_town) {
      var col, row;
      if (is_town) {
        for (col = 0; col <= 79; col++) {
          for (row = 0; row <= 19; row++) {
            data[row][col] = ".";
          }
        }
      }
    }

    Level.prototype.addPlayer = function(id, player) {
      return players[id] = player;
    };

    Level.prototype.toJSON = function(id) {
      var elements, player;
      elements = {
        pcs: {}
      };
      for (id in players) {
        player = players[id];
        elements.pcs[player.getName()] = player.getPos();
      }
      return JSON.stringify(elements);
    };

    Level.prototype.povObject = function(id) {
      var elements, player;
      elements = {
        pcs: {}
      };
      for (id in players) {
        player = players[id];
        elements.pcs[player.getName()] = player.getPos();
      }
      return elements;
    };

    Level.prototype.computeFOV = function(loc1, loc2) {
      return true;
    };

    return Level;

  })();

  module.exports = Level;

}).call(this);
