var constructMap = function (object_data, tempCopy) {
	var key, location, _ref;

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
	  tempCopy[player[1]][player[0]].tile = "@";
	  tempCopy[player[1]][player[0]].visibile = true;
	  tempCopy[player[1]][player[0]].remembered = true;

	}
	
    map = "----------------------------------------------------------------------------------</br>";
    for (_j = 0, _len2 = tempCopy.length; _j < _len2; _j++) {
      row = tempCopy[_j];
      map += "|"
      for (_x = 0, _len3 = row.length; _x < _len3; _x++) {
        if (row[_x].visible) {
          map += "<span class='visible'>" + row[_x].tile + "</span>";
        }
        else if (row[_x].remembered) {
          map += "<span class='remembered'>" + row[_x].tile + "</span>";
        }
        else {
	      map += row[_x].tile;
        }
      }
      map += "|</br>";
    }
    map += "----------------------------------------------------------------------------------";

	var col, row, _i, _j, _len, _len2;

	for (_i = 0, _len = tempCopy.length; _i < _len; _i++) {
	  row = tempCopy[_i];
	  for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
		row[_j].visible = false;
	  }
	}

    return map;
}

$(document).ready(function() {
	var tempCopy = [];
	for (var row = 0; row <= 39; row++)
		tempCopy[row] = []
	for (var col = 0; col <= 79; col++) {
	  for (var row = 0; row <= 39; row++) {
	    tempCopy[row][col] = {
		  tile: "&nbsp;",
		  visible: false,
		  remembered: false
		};;
	  }
	}
	
    var webSocket = new io.connect();
    // webSocket.connect();

    webSocket.on('level chat', function(message) {
        $('#level').append(message + '</br>');
    });
    
    webSocket.on('update', function (message) {
		console.log(message);
        $('#map').replaceWith("<div id='map'>" + constructMap(message, tempCopy) + "</div>");
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


    $('html').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        var message = "";
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
        }
    });
	$('#login').show();
});