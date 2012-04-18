var WINDOW = 40;
var getCursorPosition = function (e) {
    var x, y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    var offset = $('#map').offset();
    x -= offset.left;
    y -= offset.top;
    return [Math.floor(y/15), Math.floor(x/15)];
}

var drawMap = function (tempCopy, centery, centerx) {
    if (centerx < WINDOW/2) {
        centerx = WINDOW/2;
    }
    if (centery < WINDOW/2) {
        centery = WINDOW/2;
    }
    if (centerx > 1000 - WINDOW/2) {
        centerx = 1000 - WINDOW/2;
    }
    if (centery > 1000 - WINDOW/2) {
        centery = 1000 - WINDOW/2;
    }
    var our_canvas = $('#map');
    var ctx = our_canvas.get(0).getContext('2d');
    var tilecounter = 0;
    ctx.fillStyle = "rgb(41,41,41)";
    ctx.fillRect(0,0, our_canvas.width(), our_canvas.height());
    for (_j = centery - WINDOW/2, _len2 = centery + WINDOW/2; _j < _len2; _j++) {
      row = tempCopy[_j];
      for (_x = centerx - WINDOW/2, _len3 = centerx + WINDOW/2; _x < _len3; _x++) {
        if (row[_x].visible) {
          if (row[_x].tile == "floor" || row[_x].tile == "upstair" || row[_x].tile == "downstair") {
            ctx.fillStyle = "rgb(230,230,230)";
          }
          if (row[_x].tile == "wall") {
            ctx.fillStyle = "rgb(102,102,102)";
          }
        }
        else if (row[_x].remembered) {
          if (row[_x].tile == "floor" || row[_x].tile == "upstair" || row[_x].tile == "downstair") {
            ctx.fillStyle = "rgb(178,178,178)";
          }
          if (row[_x].tile == "wall") {
            ctx.fillStyle = "rgb(51,51,51)";
          }
        }
        if (row[_x].visible || row[_x].remembered) {
          ctx.fillRect((tilecounter % 40) * 15, Math.floor(tilecounter/40) * 15, 15, 15); // Top, left, width, height
          if (row[_x].selected == true) {
            console.log("Drawing a selected tile.");
            ctx.strokeStyle = "rgb(64,153,0)";
          }
          else {
            console.log("Setting to non selected.");
            ctx.strokeStyle = "rgb(85,98,102,0.2)";
          }
          ctx.lineWidth = .3;
          ctx.strokeRect((tilecounter % 40) * 15, Math.floor(tilecounter/40) * 15, 15, 15);
          ctx.fillStyle = "rgb(36,36,36)";
          if (row[_x].contents == "player") {
            ctx.font = "1.2em monospace"
            ctx.fillText("@", (tilecounter % 40) * 15 + 4, Math.floor(tilecounter/40) * 15 + 11);
          }
          if (row[_x].tile == "upstair") {
            ctx.font = "1.2em monospace"
            ctx.fillText("<", (tilecounter % 40) * 15 + 4, Math.floor(tilecounter/40) * 15 + 11);
          }
          if (row[_x].tile == "downstair") {
            ctx.font = "1.2em monospace"
            ctx.fillText(">", (tilecounter % 40) * 15 + 4, Math.floor(tilecounter/40) * 15 + 11);
          }
        }
        tilecounter++;
      }
    }
}

var constructMap = function (object_data, tempCopy) {
	var key, location, _ref;
	var col, row, _i, _j, _len, _len2;
    var userx, usery;

    for (_i = 0, _len = tempCopy.length; _i < _len; _i++) {
      row = tempCopy[_i];
      for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
        row[_j].visible = false;
        row[_j].contents = "";
      }
    }

	_ref = object_data.terrain;
	for (key in _ref) {
		location = _ref[key];
		//console.log(location);
		var point, _i, _len;

		for (_i = 0, _len = location.length; _i < _len; _i++) {
		  point = location[_i];
		  tempCopy[point[0]][point[1]].tile = key.toString();
		  tempCopy[point[0]][point[1]].visible = true
		  tempCopy[point[0]][point[1]].remembered = true
		}
	}
	
	var name, player;
	var players_data = object_data["pcs"];
	for (name in object_data["pcs"]) {
	  player = players_data[name];
	  tempCopy[player[1]][player[0]].tile = "floor";
	  tempCopy[player[1]][player[0]].contents = "player";
	  tempCopy[player[1]][player[0]].id = player.id;
	  tempCopy[player[1]][player[0]].visibile = true;
	  tempCopy[player[1]][player[0]].remembered = true;
	}
	
	centerx = object_data.you[0]
	centery = object_data.you[1]
	tempCopy[centery][centerx].tile = "floor"
	tempCopy[centery][centerx].contents = "player";
	tempCopy[centery][centerx].id = 0;
	tempCopy[centery][centerx].visible = true
	tempCopy[centery][centerx].remembered = false
	
    drawMap(tempCopy, centery, centerx);

	return true;
}

$(document).ready(function() {
	var tempCopy = [];
    var userx, usery;
	for (var row = 0; row <= 999; row++)
		tempCopy[row] = []
	for (var col = 0; col <= 999; col++) {
	  for (var row = 0; row <= 999; row++) {
	    tempCopy[row][col] = {
		  tile: "&nbsp;",
		  visible: false,
		  remembered: false
		};;
	  }
	}
	
    var webSocket = new io.connect();

    webSocket.on('level chat', function(message) {
        $('#level').append(message + '</br>');
        $("#level").scrollTop($("#level")[0].scrollHeight);
    });
    
    webSocket.on('update', function (message) {
		console.log(message);
        userx = message.you[0];
        usery = message.you[1];
        constructMap(message, tempCopy);
    });

    $('#levelChat').keypress(function(event) {
        if (event.which == 13) {
            var message = $('#levelChat').val();
            webSocket.emit('level chat', message);
            $('#levelChat').val('');
        }
		event.stopPropagation();
    });

	$("#map").click(function (event) {
		var infotext = "<p>A ";
        var relativecell = getCursorPosition(event);
        var visionx = userx;
        var visiony = usery;
        if (userx < WINDOW/2) {
            visionx = WINDOW/2;
        }
        if (usery < WINDOW/2) {
            visiony = WINDOW/2;
        }
        if (userx > 1000 - WINDOW/2) {
            visionx = 1000 - WINDOW/2;
        }
        if (usery > 1000 - WINDOW/2) {
            visiony = 1000 - WINDOW/2;
        }
        visiony -= WINDOW/2;
        visionx -= WINDOW/2;
        var absolutecell = [relativecell[0] + visiony, relativecell[1] + visionx];
        var tile = tempCopy[absolutecell[0]][absolutecell[1]];
        console.log(tile);
        if (tile.selected == true) {
            tile.selected = false;
            $("#info").html("");
        }
        else {
            tile.selected = true;
            if (tile.visible == true) {
                infotext += "visible ";
            }
            else if (tile.remembered == true) {
                infotext += "remembered ";
            }
            if (tile.tile == "upstair") {
                infotext += "up stair. ";
            }
            else if (tile.tile == "downstair") {
                infotext += "down stair.";
            }
            else if (tile.tile == "floor") {
                infotext += "floor.";
            }
            else if (tile.tile == "wall") {
                infotext += "wall.";
            }
            infotext += "</p><p>Contents:</p>"
            $("#info").html(infotext);
        }

        drawMap(tempCopy, usery, userx);
	});
	
    $('html').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        var message = "";
        console.log(keycode);
        switch (keycode) {
            case 104:
              message = "-1 0";
              webSocket.emit('move', message);
              break;
            case 106:
              message = "0 1";
              webSocket.emit('move', message);
              break;
            case 107:
              message = "0 -1";
              webSocket.emit('move', message);
              break;
            case 108:
              message = "1 0";
              webSocket.emit('move', message);
              break;
            case 121:
              message = "-1 -1";
              webSocket.emit('move', message);
              break;
            case 117:
              message = "1 -1";
              webSocket.emit('move', message);
              break;
            case 98:
              message = "-1 1";
              webSocket.emit('move', message);
              break;
            case 110:
              message = "1 1";
              webSocket.emit('move', message);
              break;
            case 60:
              message = "up"
              webSocket.emit('levelchange', message);
              break;
            case 62:
              message = "down"
              webSocket.emit('levelchange', message);
              break;
        }
    });
});
