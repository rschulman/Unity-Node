var constructMap = function (object_data) {
    var tempCopy = [];
    for (x = 0; x <= 19; x++) {
      tempCopy[x] = [];
    }
	var col, row;
	for (col = 0; col <= 79; col++) {
	  for (row = 0; row <= 19; row++) {
	    tempCopy[row][col] = ".";
	  }
	}

	var name, player;
	var players_data = object_data["pcs"];
	for (name in object_data["pcs"]) {
	  player = players_data[name];
	  tempCopy[player[1]][player[0]] = "<span class=\"PC\" alt=\"" + name + "\">@</span>";
	}
	
    map = "----------------------------------------------------------------------------------</br>";
    for (_j = 0, _len2 = tempCopy.length; _j < _len2; _j++) {
      row = tempCopy[_j];
      map += "|" + row.join("") + "|</br>";
    }
    map += "----------------------------------------------------------------------------------";

    return map;
}

$(document).ready(function() {
    var webSocket = new io.connect();
    // webSocket.connect();

    webSocket.on('level chat', function(message) {
        $('#level').append(message + '</br>');
    });
    
    webSocket.on('map', function (message) {
        $('#map').replaceWith("<div id='map'>" + constructMap(message) + "</div>");
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