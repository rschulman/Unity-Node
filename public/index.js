var constructMap = function (object_data, tempCopy) {
	var key, location, _ref;
	var WINDOW = 40;
	
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
    var our_canvas = $("#map");
    var ctx = our_canvas.getContext('2d');
    ctx.clearRect(0, 0, our_canvas.width(), our_canvas.height());
	var tilecounter = 0;
    ctx.fillStyle = "rgb(41,41,41,)";
    ctx.fillRect(0,0, our_canvas.width(), our_canvas.height());
	for (_j = centery - WINDOW/2, _len2 = centery + WINDOW/2; _j < _len2; _j++) {
      row = tempCopy[_j];
      for (_x = centerx - WINDOW/2, _len3 = centerx + WINDOW/2; _x < _len3; _x++) {
        if (row[_x].visible) {
          if (row[_x].tile == "floor") {
            ctx.fillStyle = "rgb(230,230,230)";
          }
          if (row[_x].tile == "wall") {
            ctx.fillStyle = "rgb(102,102,102)";
          }
          ctx.fillRect(Math.floor(tilecounter/40), tilecounter % 40, 15, 15); // Top, left, width, height
          if (row[_x].contents == "player") {
            ctx.font = ".9em monospace"
            ctx.fillText("@", Math.floor(tilecounter/40) + 7, (tilecounter % 40) + 7);
		  }
		  if (row[_x].tile == "upstair") {
            ctx.font = ".9em monospace"
            ctx.fillText("<", Math.floor(tilecounter/40) + 7, (tilecounter % 40) + 7);
		  }
		  if (row[_x].tile == "downstair") {
            ctx.font = ".9em monospace"
            ctx.fillText(">", Math.floor(tilecounter/40) + 7, (tilecounter % 40) + 7);
		  }
        }
        else if (row[_x].remembered) {
          if (row[_x].tile == "floor") {
            ctx.fillStyle = "rgb(178,178,178)";
          }
          if (row[_x].tile == "wall") {
            ctx.fillStyle = "rgb(51,51,51)";
          }
          ctx.fillRect(Math.floor(tilecounter/40), tilecounter % 40, 15, 15); // Top, left, width, height
          if (row[_x].contents == "player") {
            ctx.font = ".9em monospace"
            ctx.fillText("@", Math.floor(tilecounter/40) + 7, (tilecounter % 40) + 7);
          }
          if (row[_x].tile == "upstair") {
            ctx.font = ".9em monospace"
            ctx.fillText("<", Math.floor(tilecounter/40) + 7, (tilecounter % 40) + 7);
          }
          if (row[_x].tile == "downstair") {
            ctx.font = ".9em monospace"
            ctx.fillText(">", Math.floor(tilecounter/40) + 7, (tilecounter % 40) + 7);
          }
	    }
		tilecounter++;
      }
    }

	var col, row, _i, _j, _len, _len2;

	for (_i = 0, _len = tempCopy.length; _i < _len; _i++) {
	  row = tempCopy[_i];
	  for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
		row[_j].visible = false;
		row[_j].contents = "";
	  }
	}
	return true;
}

$(document).ready(function() {
	var tempCopy = [];
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
        constructMap(message, tempCopy);
    })

    webSocket.on('map', function (message) {
		
    })

    $('#nameText').keypress(function(event) {
        if (event.which == 13) {
            var message = $('#nameText').val();
            webSocket.emit('new user', message);
            $('#nameText').val('');
			$('#login').hide();
			$("#messages").show();
        }
		event.stopPropagation();
    });

    $('#levelChat').keypress(function(event) {
        if (event.which == 13) {
            var message = $('#levelChat').val();
            webSocket.emit('level chat', message);
            $('#levelChat').val('');
        }
		event.stopPropagation();
    });


	$("#map").on("click", function (event) {
		var infotext = "<p>A ";
		var $target = $(event.target);
		if ($target.hasClass("visible")) {
			infotext += "visible ";
		}
		else if ($target.hasClass("remembered")) {
			infotext += "remembered ";
		}
		if ($target.hasClass("upstair")) {
			infotext += "up stair. ";
		}
		else if ($target.hasClass("downstair")) {
			infotext += "down stair.";
		}
		else if ($target.hasClass("floor")) {
			infotext += "floor.";
		}
		else if ($target.hasClass("wall")) {
			infotext += "wall.";
		}
		infotext += "</p><p>Contents:</p>"
		
		$("#info").html(infotext);
		$(".clicked").toggleClass("clicked");
		$target.addClass("clicked");
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