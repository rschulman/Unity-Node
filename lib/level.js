(function() {
  var Level;

  Level = (function() {
    var MAXCOLS, MAXROWS, arrays_equal, data, digpoint, digroom, downx, downy, players, upx, upy, x;

    MAXROWS = 999;

    MAXCOLS = 999;

    data = [];

    for (x = 0; 0 <= MAXROWS ? x <= MAXROWS : x >= MAXROWS; 0 <= MAXROWS ? x++ : x--) {
      data[x] = [];
    }

    players = {};

    downy = 0;

    downx = 0;

    upy = 0;

    upx = 0;

    arrays_equal = function(a, b) {
      return !(a < b || b < a);
    };

    digroom = function(x, y, w, h) {
      var col, row, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results;
      for (col = _ref = x - 1, _ref2 = x + w; _ref <= _ref2 ? col <= _ref2 : col >= _ref2; _ref <= _ref2 ? col++ : col--) {
        data[y - 1][col] = "wall";
      }
      for (col = _ref3 = x - 1, _ref4 = x + w; _ref3 <= _ref4 ? col <= _ref4 : col >= _ref4; _ref3 <= _ref4 ? col++ : col--) {
        data[y + h][col] = "wall";
      }
      for (row = _ref5 = y - 1, _ref6 = y + h; _ref5 <= _ref6 ? row <= _ref6 : row >= _ref6; _ref5 <= _ref6 ? row++ : row--) {
        data[row][x - 1] = "wall";
      }
      for (row = _ref7 = y - 1, _ref8 = y + h; _ref7 <= _ref8 ? row <= _ref8 : row >= _ref8; _ref7 <= _ref8 ? row++ : row--) {
        data[row][x + w] = "wall";
      }
      _results = [];
      for (row = y, _ref9 = y + h - 1; y <= _ref9 ? row <= _ref9 : row >= _ref9; y <= _ref9 ? row++ : row--) {
        _results.push((function() {
          var _ref10, _results2;
          _results2 = [];
          for (col = x, _ref10 = x + w - 1; x <= _ref10 ? col <= _ref10 : col >= _ref10; x <= _ref10 ? col++ : col--) {
            _results2.push(data[row][col] = "floor");
          }
          return _results2;
        })());
      }
      return _results;
    };

    digpoint = function(x, y) {
      data[y][x] = "floor";
      if (data[y + 1][x] === " ") data[y + 1][x] = "wall";
      if (data[y - 1][x] === " ") data[y - 1][x] = "wall";
      if (data[y][x + 1] === " ") data[y][x + 1] = "wall";
      if (data[y][x - 1] === " ") data[y][x - 1] = "wall";
      if (data[y + 1][x + 1] === " ") data[y + 1][x + 1] = "wall";
      if (data[y - 1][x - 1] === " ") data[y - 1][x - 1] = "wall";
      if (data[y - 1][x + 1] === " ") data[y - 1][x + 1] = "wall";
      if (data[y + 1][x - 1] === " ") return data[y + 1][x - 1] = "wall";
    };

    function Level(is_town) {
      var col, donedown, doneup, exitdigs, exitlength, exitx, exity, firstroomx, firstroomy, iter, room_track, roomh, rooms, roomw, row, staircol, stairrow, startx, starty, thispoint, valid, workingroom, _i, _len, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (is_town) {
        for (col = 0; 0 <= MAXCOLS ? col <= MAXCOLS : col >= MAXCOLS; 0 <= MAXCOLS ? col++ : col--) {
          for (row = 0; 0 <= MAXROWS ? row <= MAXROWS : row >= MAXROWS; 0 <= MAXROWS ? row++ : row--) {
            data[row][col] = "floor";
          }
        }
        stairrow = Math.floor(Math.random() * 40);
        staircol = Math.floor(Math.random() * 80);
        data[stairrow][staircol] = "downstair";
      } else {
        for (col = 0; 0 <= MAXROWS ? col <= MAXROWS : col >= MAXROWS; 0 <= MAXROWS ? col++ : col--) {
          for (row = 0; 0 <= MAXROWS ? row <= MAXROWS : row >= MAXROWS; 0 <= MAXROWS ? row++ : row--) {
            data[row][col] = " ";
          }
        }
        firstroomx = Math.floor(Math.random() * 10) + 5;
        firstroomy = Math.floor(Math.random() * 10) + 5;
        roomw = Math.floor(Math.random() * 10) + 5;
        roomh = Math.floor(Math.random() * 10) + 5;
        digroom(firstroomx, firstroomy, roomw, roomh, data);
        room_track = [];
        room_track.push([firstroomx, firstroomy, roomh, roomw]);
        for (rooms = 1; rooms <= 24; rooms++) {
          valid = false;
          while (!valid) {
            console.log("Trying...");
            workingroom = Math.floor(Math.random() * room_track.length);
            roomw = Math.floor(Math.random() * 10) + 5;
            roomh = Math.floor(Math.random() * 10) + 5;
            exitdigs = [];
            exitlength = Math.floor(Math.random() * 4) + 7;
            switch ((Math.floor(Math.random() * 4)) + 1) {
              case 1:
                exitx = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][0];
                exity = room_track[workingroom][1] - 1;
                startx = exitx - (Math.floor(Math.random() * roomw));
                starty = exity - roomh - exitlength - 1;
                for (iter = 0, _ref = exitlength + 1; 0 <= _ref ? iter <= _ref : iter >= _ref; 0 <= _ref ? iter++ : iter--) {
                  exitdigs.push([exitx, exity - iter]);
                }
                console.log("North: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 2:
                exitx = room_track[workingroom][0] + room_track[workingroom][3];
                exity = (Math.floor(Math.random() * room_track[workingroom][2])) + room_track[workingroom][1];
                startx = exitx + exitlength;
                starty = exity - (Math.floor(Math.random() * roomh));
                for (iter = 0, _ref2 = exitlength + 1; 0 <= _ref2 ? iter <= _ref2 : iter >= _ref2; 0 <= _ref2 ? iter++ : iter--) {
                  exitdigs.push([exitx + iter, exity]);
                }
                console.log("East: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 3:
                exitx = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][0];
                exity = room_track[workingroom][1] + room_track[workingroom][2];
                startx = exitx - (Math.floor(Math.random() * roomw));
                starty = exity + exitlength;
                for (iter = 0, _ref3 = exitlength + 1; 0 <= _ref3 ? iter <= _ref3 : iter >= _ref3; 0 <= _ref3 ? iter++ : iter--) {
                  exitdigs.push([exitx, exity + iter]);
                }
                console.log("South: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 4:
                exitx = room_track[workingroom][0] - 1;
                exity = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][1];
                startx = exitx - roomw - exitlength - 1;
                starty = exity - (Math.floor(Math.random() * roomh));
                for (iter = 0, _ref4 = exitlength + 1; 0 <= _ref4 ? iter <= _ref4 : iter >= _ref4; 0 <= _ref4 ? iter++ : iter--) {
                  exitdigs.push([exitx - iter, exity]);
                }
                console.log("West: " + startx + ", " + starty + " " + roomw + " x " + roomh);
            }
            valid = true;
            if (starty > 0 && startx > 0 && starty + roomh <= MAXROWS && startx + roomw <= MAXCOLS) {
              for (row = starty, _ref5 = starty + roomh; starty <= _ref5 ? row <= _ref5 : row >= _ref5; starty <= _ref5 ? row++ : row--) {
                for (col = startx, _ref6 = startx + roomw; startx <= _ref6 ? col <= _ref6 : col >= _ref6; startx <= _ref6 ? col++ : col--) {
                  if (data[row][col] !== " ") {
                    valid = false;
                    row = starty + roomh + 1;
                    col = startx + roomw + 1;
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
          for (_i = 0, _len = exitdigs.length; _i < _len; _i++) {
            thispoint = exitdigs[_i];
            digpoint(thispoint[0], thispoint[1]);
          }
          room_track.push([startx, starty, roomh, roomw]);
        }
        stairrow = Math.floor(Math.random() * MAXROWS);
        staircol = Math.floor(Math.random() * MAXCOLS);
        while (!donedown) {
          if (data[stairrow][staircol] === "floor") {
            data[stairrow][staircol] = "downstair";
            downy = stairrow;
            downx = staircol;
            donedown = true;
          }
          stairrow = Math.floor(Math.random() * MAXROWS);
          staircol = Math.floor(Math.random() * MAXCOLS);
        }
        stairrow = Math.floor(Math.random() * MAXROWS);
        staircol = Math.floor(Math.random() * MAXCOLS);
        while (!doneup) {
          if (data[stairrow][staircol] === "floor") {
            data[stairrow][staircol] = "upstair";
            upy = stairrow;
            upx = staircol;
            doneup = true;
          }
          stairrow = Math.floor(Math.random() * MAXROWS);
          staircol = Math.floor(Math.random() * MAXCOLS);
        }
      }
    }

    Level.prototype.addPlayer = function(id, player) {
      player.x = upx;
      player.y = upy;
      return players[id] = player;
    };

    Level.prototype.movePlayer = function(socketid, vector) {
      var currentx, currenty, subject, _ref;
      subject = players[socketid];
      currentx = subject.x;
      currenty = subject.y;
      if (currentx + parseInt(vector[0]) < 0 || currentx + parseInt(vector[0]) > MAXROWS) {
        return false;
      }
      if (currenty + parseInt(vector[1]) < 0 || currenty + parseInt(vector[1]) > MAXCOLS) {
        return false;
      }
      if ((_ref = data[currenty + parseInt(vector[1])][currentx + parseInt(vector[0])]) !== "floor" && _ref !== "upstair" && _ref !== "downstair") {
        return false;
      }
      subject.x += parseInt(vector[0]);
      subject.y += parseInt(vector[1]);
      return true;
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
      var centerx, centery, checking, directionx, directiony, dist, elements, item, nextinrayx, nextinrayy, presensecheck, radian, subject, vision, wallbug, xmove, ymove;
      vision = 8;
      radian = 0;
      subject = players[id];
      elements = {
        pcs: {},
        terrain: {
          "wall": [],
          "floor": [],
          "upstair": [],
          "downstair": [],
          " ": []
        }
      };
      if (players[id]) {
        while (radian <= 2 * Math.PI) {
          centerx = players[id].x + .5;
          centery = players[id].y + .5;
          xmove = Math.cos(radian);
          ymove = Math.sin(radian);
          wallbug = false;
          for (dist = 1; 1 <= vision ? dist <= vision : dist >= vision; 1 <= vision ? dist++ : dist--) {
            centerx += xmove;
            centery += ymove;
            if (centerx > MAXCOLS || centery > MAXCOLS || centerx < 0 || centery < 0) {
              break;
            }
            presensecheck = (function() {
              var _i, _len, _ref, _results;
              _ref = elements.terrain[data[Math.floor(centery)][Math.floor(centerx)]];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                _results.push(arrays_equal(item, [Math.floor(centery), Math.floor(centerx)]));
              }
              return _results;
            })();
            if (presensecheck.indexOf(true) === -1) {
              elements.terrain[data[Math.floor(centery)][Math.floor(centerx)]].push([Math.floor(centery), Math.floor(centerx)]);
            }
            for (id in players) {
              checking = players[id];
              if (checking.x === Math.floor(centerx) && checking.y === Math.floor(centery)) {
                elements.pcs[checking.getName()] = [checking.x, checking.y, id];
              }
            }
            if (data[Math.floor(centery)][Math.floor(centerx)] === "wall") {
              nextinrayx = centerx + xmove;
              nextinrayy = centery + ymove;
              if (data[Math.floor(nextinrayy)][Math.floor(nextinrayx)] === "wall") {
                directiony = centery - nextinrayy;
                directionx = centerx - nextinrayx;
                if (Math.abs(directiony) === 1 && Math.abs(directionx) === 1) {
                  wallbug = true;
                }
                if (Math.abs(directiony === 1)) {
                  if (data[Math.floor(centery)][Math.floor(centerx + 1)] === "floor" || data[Math.floor(centery)][Math.floor(centerx - 1)] === "floor") {
                    wallbug = true;
                  }
                }
                if (Math.abs(directionx === 1)) {
                  if (data[Math.floor(centery + 1)][Math.floor(centerx)] === "floor" || data[Math.floor(centery - 1)][Math.floor(centerx)] === "floor") {
                    wallbug = true;
                  }
                }
              }
              if (!wallbug) break;
              wallbug = false;
            }
          }
          radian += .025;
        }
      }
      elements.you = [players[id].x, players[id].y];
      return elements;
    };

    return Level;

  })();

  module.exports = Level;

}).call(this);
