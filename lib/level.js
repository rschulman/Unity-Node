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

    Level.prototype.toString = function() {
      var id, map, player, row, tempCopy, whereishe, _i, _j, _len, _len2;
      tempCopy = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        row = data[_i];
        tempCopy.push(row.slice(0, row.length));
      }
      for (id in players) {
        player = players[id];
        whereishe = player.getPos();
        tempCopy[whereishe[1]][whereishe[0]] = "@";
      }
      map = "--------------------------------------------------------------------------------\n";
      for (_j = 0, _len2 = tempCopy.length; _j < _len2; _j++) {
        row = tempCopy[_j];
        map += "|" + row.join("") + "|\n";
      }
      map += "--------------------------------------------------------------------------------";
      return map;
    };

    return Level;

  })();

  module.exports = Level;

}).call(this);
