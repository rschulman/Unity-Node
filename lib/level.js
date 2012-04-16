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

    function Level(options, saved) {
      var col, donedown, doneup, exitdigs, exitlength, exitx, exity, firstroomx, firstroomy, iter, room_track, roomh, rooms, roomw, row, staircol, stairrow, startx, starty, thispoint, tile, valid, workingroom, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (!options.generate) {
        for (col = 0; 0 <= MAXROWS ? col <= MAXROWS : col >= MAXROWS; 0 <= MAXROWS ? col++ : col--) {
          for (row = 0; 0 <= MAXROWS ? row <= MAXROWS : row >= MAXROWS; 0 <= MAXROWS ? row++ : row--) {
            data[row][col] = " ";
          }
        }
        _ref = saved.data["wall"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tile = _ref[_i];
          data[tile[0]][tile[1]] = "wall";
        }
        _ref2 = saved.data["floor"];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          tile = _ref2[_j];
          data[tile[0]][tile[1]] = "floor";
        }
        _ref3 = saved.data["upstair"];
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          tile = _ref3[_k];
          data[tile[0]][tile[1]] = "upstair";
        }
        _ref4 = saved.data["downstair"];
        for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
          tile = _ref4[_l];
          data[tile[0]][tile[1]] = "downstair";
        }
        downy = saved.downstair[0];
        downx = saved.downstair[1];
        upy = saved.upstair[0];
        upx = saved.upstair[1];
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
                for (iter = 0, _ref5 = exitlength + 1; 0 <= _ref5 ? iter <= _ref5 : iter >= _ref5; 0 <= _ref5 ? iter++ : iter--) {
                  exitdigs.push([exitx, exity - iter]);
                }
                console.log("North: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 2:
                exitx = room_track[workingroom][0] + room_track[workingroom][3];
                exity = (Math.floor(Math.random() * room_track[workingroom][2])) + room_track[workingroom][1];
                startx = exitx + exitlength;
                starty = exity - (Math.floor(Math.random() * roomh));
                for (iter = 0, _ref6 = exitlength + 1; 0 <= _ref6 ? iter <= _ref6 : iter >= _ref6; 0 <= _ref6 ? iter++ : iter--) {
                  exitdigs.push([exitx + iter, exity]);
                }
                console.log("East: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 3:
                exitx = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][0];
                exity = room_track[workingroom][1] + room_track[workingroom][2];
                startx = exitx - (Math.floor(Math.random() * roomw));
                starty = exity + exitlength;
                for (iter = 0, _ref7 = exitlength + 1; 0 <= _ref7 ? iter <= _ref7 : iter >= _ref7; 0 <= _ref7 ? iter++ : iter--) {
                  exitdigs.push([exitx, exity + iter]);
                }
                console.log("South: " + startx + ", " + starty + " " + roomw + " x " + roomh);
                break;
              case 4:
                exitx = room_track[workingroom][0] - 1;
                exity = (Math.floor(Math.random() * room_track[workingroom][3])) + room_track[workingroom][1];
                startx = exitx - roomw - exitlength - 1;
                starty = exity - (Math.floor(Math.random() * roomh));
                for (iter = 0, _ref8 = exitlength + 1; 0 <= _ref8 ? iter <= _ref8 : iter >= _ref8; 0 <= _ref8 ? iter++ : iter--) {
                  exitdigs.push([exitx - iter, exity]);
                }
                console.log("West: " + startx + ", " + starty + " " + roomw + " x " + roomh);
            }
            valid = true;
            if (starty > 0 && startx > 0 && starty + roomh <= MAXROWS && startx + roomw <= MAXCOLS) {
              for (row = starty, _ref9 = starty + roomh; starty <= _ref9 ? row <= _ref9 : row >= _ref9; starty <= _ref9 ? row++ : row--) {
                for (col = startx, _ref10 = startx + roomw; startx <= _ref10 ? col <= _ref10 : col >= _ref10; startx <= _ref10 ? col++ : col--) {
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
          for (_m = 0, _len5 = exitdigs.length; _m < _len5; _m++) {
            thispoint = exitdigs[_m];
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

    Level.prototype.save = function(levelCollection, depth) {
      var col, row, terrain, updatehash;
      terrain = {
        "wall": [],
        "floor": [],
        "upstair": [],
        "downstair": []
      };
      for (row = 0; 0 <= MAXROWS ? row <= MAXROWS : row >= MAXROWS; 0 <= MAXROWS ? row++ : row--) {
        for (col = 0; 0 <= MAXROWS ? col <= MAXROWS : col >= MAXROWS; 0 <= MAXROWS ? col++ : col--) {
          if (data[row][col] !== " ") terrain[data[row][col]].push([row, col]);
        }
      }
      updatehash = {
        dlvl: depth,
        data: terrain,
        downstair: [downy, downx],
        upstair: [upy, upx]
      };
      return levelCollection.update({
        dlvl: depth
      }, {
        $set: updatehash
      }, {
        safe: true,
        upsert: true
      }, function(err) {
        if (err) {
          return console.log(err);
        } else {
          return console.log("Saved level: " + depth);
        }
      });
    };

    Level.prototype.canLeave = function(id, direction) {
      var mover;
      mover = players[id];
      if (direction === "up" && mover.x === upx && mover.y === upy) {
        delete players[id];
        return true;
      } else if (direction === "down" && mover.x === downx && mover.y === downy) {
        delete players[id];
        return true;
      } else {
        return false;
      }
    };

    Level.prototype.addPlayer = function(id, player, options) {
      if (player.x === -1 || player.y === -1 || data[player.y][player.x] !== "floor") {
        player.x = upx;
        player.y = upy;
      }
      if (options.stairs === true) {
        if (options.comingup === true) {
          player.x = downx;
          player.y = downy;
        } else {
          player.x = upx;
          player.y = upy;
        }
      }
      players[id] = player;
      return true;
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

    Level.prototype.povObject = function(sockets) {
      var centerx, centery, checking, directionx, directiony, dist, elements, id, item, nextinrayx, nextinrayy, presensecheck, radian, subject, targetid, vision, wallbug, xmove, ymove;
      vision = 8;
      for (id in players) {
        subject = players[id];
        radian = 0;
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
        while (radian <= 2 * Math.PI) {
          centerx = subject.x + .5;
          centery = subject.y + .5;
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
            for (targetid in players) {
              checking = players[targetid];
              if (checking.x === Math.floor(centerx) && checking.y === Math.floor(centery)) {
                elements.pcs[checking.getName()] = [checking.x, checking.y, targetid];
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
        elements.you = [subject.x, subject.y];
        sockets.socket(id).emit('update', elements);
      }
      return true;
    };

    Level.prototype.playerLogOut = function(id) {
      return delete players[id];
    };

    return Level;

  })();

  module.exports = Level;

}).call(this);
