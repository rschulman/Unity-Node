(function() {
  var Level;

  Level = (function() {
    var data, digpoint, digroom, players, x;

    data = [];

    for (x = 0; x <= 39; x++) {
      data[x] = [];
    }

    players = {};

    digroom = function(x, y, w, h) {
      var col, row, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results;
      for (col = _ref = x - 1, _ref2 = x + w; _ref <= _ref2 ? col <= _ref2 : col >= _ref2; _ref <= _ref2 ? col++ : col--) {
        data[y - 1][col] = "#";
      }
      for (col = _ref3 = x - 1, _ref4 = x + w; _ref3 <= _ref4 ? col <= _ref4 : col >= _ref4; _ref3 <= _ref4 ? col++ : col--) {
        data[y + h][col] = "#";
      }
      for (row = _ref5 = y - 1, _ref6 = y + h; _ref5 <= _ref6 ? row <= _ref6 : row >= _ref6; _ref5 <= _ref6 ? row++ : row--) {
        data[row][x - 1] = "#";
      }
      for (row = _ref7 = y - 1, _ref8 = y + h; _ref7 <= _ref8 ? row <= _ref8 : row >= _ref8; _ref7 <= _ref8 ? row++ : row--) {
        data[row][x + w] = "#";
      }
      _results = [];
      for (row = y, _ref9 = y + h - 1; y <= _ref9 ? row <= _ref9 : row >= _ref9; y <= _ref9 ? row++ : row--) {
        _results.push((function() {
          var _ref10, _results2;
          _results2 = [];
          for (col = x, _ref10 = x + w - 1; x <= _ref10 ? col <= _ref10 : col >= _ref10; x <= _ref10 ? col++ : col--) {
            _results2.push(data[row][col] = ".");
          }
          return _results2;
        })());
      }
      return _results;
    };

    digpoint = function(x, y) {
      data[y][x] = ".";
      if (data[y + 1][x] === "&nbsp;") data[y + 1][x] = "#";
      if (data[y - 1][x] === "&nbsp;") data[y - 1][x] = "#";
      if (data[y][x + 1] === "&nbsp;") data[y][x + 1] = "#";
      if (data[y][x - 1] === "&nbsp;") data[y][x - 1] = "#";
      if (data[y + 1][x + 1] === "&nbsp;") data[y + 1][x + 1] = "#";
      if (data[y - 1][x - 1] === "&nbsp;") data[y - 1][x - 1] = "#";
      if (data[y - 1][x + 1] === "&nbsp;") data[y - 1][x + 1] = "#";
      if (data[y + 1][x - 1] === "&nbsp;") return data[y + 1][x - 1] = "#";
    };

    function Level(is_town) {
      var col, donedown, doneup, exitdigs, exitx, exity, firstroomx, firstroomy, room_track, roomh, rooms, roomw, row, staircol, stairrow, startx, starty, valid, workingroom, _ref, _ref2;
      if (is_town) {
        for (col = 0; col <= 79; col++) {
          for (row = 0; row <= 39; row++) {
            data[row][col] = ".";
          }
        }
        stairrow = Math.floor(Math.random() * 40);
        staircol = Math.floor(Math.random() * 80);
        data[stairrow][staircol] = ">";
      } else {
        for (col = 0; col <= 79; col++) {
          for (row = 0; row <= 39; row++) {
            data[row][col] = "&nbsp;";
          }
        }
        firstroomx = Math.floor(Math.random() * 10) + 5;
        firstroomy = Math.floor(Math.random() * 10) + 5;
        roomw = Math.floor(Math.random() * 10) + 5;
        roomh = Math.floor(Math.random() * 10) + 5;
        digroom(firstroomx, firstroomy, roomw, roomh, data);
        room_track = [];
        room_track.push([firstroomx, firstroomy, roomh, roomw]);
        for (rooms = 1; rooms <= 5; rooms++) {
          valid = false;
          while (!valid) {
            console.log("Trying...");
            workingroom = Math.floor(Math.random() * room_track.length);
            roomw = Math.floor(Math.random() * 10) + 5;
            roomh = Math.floor(Math.random() * 10) + 5;
            switch ((Math.floor(Math.random() * 4)) + 1) {
              case 1:
                exitx = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][0];
                exity = room_track[workingroom][1] - 1;
                startx = exitx - (Math.floor(Math.random() * roomw));
                starty = exity - roomh - 2;
                exitdigs = [[exitx, exity], [exitx, exity - 1], [exitx, exity - 2]];
                console.log("North: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 2:
                exitx = room_track[workingroom][0] + room_track[workingroom][3];
                exity = (Math.floor(Math.random() * room_track[workingroom][2])) + room_track[workingroom][1];
                startx = exitx + 3;
                starty = exity - (Math.floor(Math.random() * roomh));
                exitdigs = [[exitx, exity], [exitx + 1, exity], [exitx + 2, exity]];
                console.log("East: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 3:
                exitx = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][0];
                exity = room_track[workingroom][1] + room_track[workingroom][2];
                startx = exitx - (Math.floor(Math.random() * roomw));
                starty = exity + 3;
                exitdigs = [[exitx, exity], [exitx, exity + 1], [exitx, exity + 2]];
                console.log("South: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 4:
                exitx = room_track[workingroom][0] - 1;
                exity = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][1];
                startx = exitx - roomw - 2;
                starty = exity - (Math.floor(Math.random() * roomh));
                exitdigs = [[exitx, exity], [exitx - 1, exity], [exitx - 2, exity]];
                console.log("West: " + startx + ", " + starty + " " + roomw + " x " + roomh);
            }
            valid = true;
            if (starty > 0 && startx > 0 && starty + roomh < 40 && startx + roomw < 80) {
              for (row = starty, _ref = starty + roomh; starty <= _ref ? row <= _ref : row >= _ref; starty <= _ref ? row++ : row--) {
                for (col = startx, _ref2 = startx + roomw; startx <= _ref2 ? col <= _ref2 : col >= _ref2; startx <= _ref2 ? col++ : col--) {
                  if (data[row][col] !== "&nbsp;") {
                    valid = false;
                    console.log("Failure: Room collision!");
                  }
                }
              }
            } else {
              valid = false;
              console.log("Failure: Room out of bounds!");
            }
          }
          digroom(startx, starty, roomw, roomh);
          digpoint(exitdigs[0][0], exitdigs[0][1]);
          digpoint(exitdigs[1][0], exitdigs[1][1]);
          digpoint(exitdigs[2][0], exitdigs[2][1]);
          room_track.push([startx, starty, roomh, roomw]);
        }
        stairrow = Math.floor(Math.random() * 40);
        staircol = Math.floor(Math.random() * 80);
        while (!donedown) {
          if (data[stairrow][staircol] === ".") {
            data[stairrow][staircol] = ">";
            donedown = true;
          }
          stairrow = Math.floor(Math.random() * 40);
          staircol = Math.floor(Math.random() * 80);
        }
        stairrow = Math.floor(Math.random() * 40);
        staircol = Math.floor(Math.random() * 80);
        while (!doneup) {
          if (data[stairrow][staircol] === ".") {
            data[stairrow][staircol] = "<";
            doneup = true;
          }
          stairrow = Math.floor(Math.random() * 40);
          staircol = Math.floor(Math.random() * 80);
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
      elements.map = data;
      return elements;
    };

    Level.prototype.computeFOV = function(loc1, loc2) {
      return true;
    };

    return Level;

  })();

  module.exports = Level;

}).call(this);
