class Level
	data = []
	data[x] = [] for x in [0..39]
	players = {}
	downy = 0
	downx = 0
	upy = 0
	upx = 0

	digroom = (x, y, w, h) ->
		data[y-1][col] = "#" for col in [x-1..x+w]
		data[y+h][col] = "#" for col in [x-1..x+w]
		data[row][x-1] = "#" for row in [y-1..y+h]
		data[row][x+w] = "#" for row in [y-1..y+h]
		data[row][col] = "." for col in [x..x+w - 1] for row in [y..y+h - 1]

	digpoint = (x, y) ->
		data[y][x] = "."
		data[y+1][x] = "#" if data[y+1][x] == "&nbsp;"
		data[y-1][x] = "#" if data[y-1][x] == "&nbsp;"
		data[y][x+1] = "#" if data[y][x+1] == "&nbsp;"
		data[y][x-1] = "#" if data[y][x-1] == "&nbsp;"
		data[y+1][x+1] = "#" if data[y+1][x+1] == "&nbsp;"
		data[y-1][x-1] = "#" if data[y-1][x-1] == "&nbsp;"
		data[y-1][x+1] = "#" if data[y-1][x+1] == "&nbsp;"
		data[y+1][x-1] = "#" if data[y+1][x-1] == "&nbsp;"

	constructor: (is_town) ->
		if is_town
			data[row][col] = "." for row in [0..39] for col in [0..79]
			stairrow = Math.floor Math.random() * 40
			staircol = Math.floor Math.random() * 80
			data[stairrow][staircol] = ">"
		else
			# Time to generate a random level...
			# Random range = Math.floor(Math.random() * (to-from+1) + from)
			data[row][col] = "&nbsp;" for row in [0..39] for col in [0..79]
			firstroomx = Math.floor(Math.random() * 10) + 5
			firstroomy = Math.floor(Math.random() * 10) + 5
			roomw = Math.floor(Math.random() * 10) + 5 # Get a random height and width between 5 and 15
			roomh = Math.floor(Math.random() * 10) + 5
			digroom firstroomx, firstroomy, roomw, roomh, data
			room_track = []
			room_track.push [firstroomx, firstroomy, roomh, roomw]
			# Now push rooms off of the origin room.
			for rooms in [1..9]
				valid = false
				until valid
					console.log "Trying..."
					workingroom = Math.floor(Math.random() * room_track.length) # Pick a room from the existing rooms at random.
					roomw = Math.floor(Math.random() * 10) + 5 # Get a random height and width between 5 and 15
					roomh = Math.floor(Math.random() * 10) + 5
					# rand 1-4 for side of room then rand size of that wall for entrance.
					switch (Math.floor Math.random() * 4) + 1
						when 1
							exitx = (Math.floor Math.random() * room_track[workingroom][3]) + room_track[workingroom][0] # Pick a spot on the north wall
							exity = room_track[workingroom][1] - 1
							startx = exitx - (Math.floor Math.random() * roomw)
							starty = exity - roomh - 2
							exitdigs = [[exitx, exity], [exitx, exity-1], [exitx, exity-2]]
							console.log "North: " + startx + ", " + starty + " " + roomw + " x " + roomh
						when 2
							exitx = room_track[workingroom][0] + room_track[workingroom][3] # Pick a spot on the east wall
							exity = (Math.floor Math.random() * room_track[workingroom][2]) + room_track[workingroom][1]
							startx = exitx + 3
							starty = exity - (Math.floor Math.random() * roomh)
							exitdigs = [[exitx, exity], [exitx+1, exity], [exitx+2, exity]]
							console.log "East: " + startx + ", " + starty + " " + roomw + " x " + roomh
						when 3
							exitx = (Math.floor Math.random() * room_track[workingroom][3]) + room_track[workingroom][0] # Pick a spot on the south wall
							exity = room_track[workingroom][1] + room_track[workingroom][2]
							startx = exitx - (Math.floor Math.random() * roomw)
							starty = exity + 3
							exitdigs = [[exitx, exity], [exitx, exity+1], [exitx, exity+2]]
							console.log "South: " + startx + ", " + starty + " " + roomw + " x " + roomh
						when 4
							exitx = room_track[workingroom][0] - 1# Pick a spot on the west wall
							exity = (Math.floor Math.random() * room_track[workingroom][3]) + room_track[workingroom][1]
							startx = exitx - roomw - 2
							starty = exity - (Math.floor Math.random() * roomh)
							exitdigs = [[exitx, exity], [exitx-1, exity], [exitx-2, exity]]
							console.log "West: " + startx + ", " + starty + " " + roomw + " x " + roomh
					valid = true
					if starty > 0 and startx > 0 and starty + roomh < 40 and startx + roomw < 80
						for row in [starty..starty + roomh]
							for col in [startx..startx + roomw]
								unless data[row][col] == "&nbsp;"
									valid = false
									console.log "Failure: Room collision!"
					else
						valid = false
						console.log "Failure: Room out of bounds!"
				digroom startx, starty, roomw, roomh
				digpoint exitdigs[0][0], exitdigs[0][1]
				digpoint exitdigs[1][0], exitdigs[1][1]
				digpoint exitdigs[2][0], exitdigs[2][1]
				room_track.push [startx, starty, roomh, roomw]
			stairrow = Math.floor Math.random() * 40
			staircol = Math.floor Math.random() * 80
			until donedown
				if data[stairrow][staircol] == "."
					data[stairrow][staircol] = ">"
					downy = stairrow
					downx = staircol
					donedown = true
				stairrow = Math.floor Math.random() * 40
				staircol = Math.floor Math.random() * 80
			stairrow = Math.floor Math.random() * 40
			staircol = Math.floor Math.random() * 80
			until doneup
				if data[stairrow][staircol] == "."
					data[stairrow][staircol] = "<"
					upy = stairrow
					upx = staircol
					doneup = true
				stairrow = Math.floor Math.random() * 40
				staircol = Math.floor Math.random() * 80
	
	addPlayer: (id, player) ->
		player.x = upx
		player.y = upy
		players[id] = player
		
	movePlayer: (socketid, vector) ->
		subject = players[socketid]
		currentx = subject.x
		currenty = subject.y
		if currentx + parseInt(vector[0]) < 0 or currentx + parseInt(vector[0]) > 79 then return false
		if currenty + parseInt(vector[1]) < 0 or currenty + parseInt(vector[1]) > 39 then return false
		if data[currenty + parseInt(vector[1])][currentx + parseInt(vector[0])] not in [".","<",">"] then return false
		subject.x += parseInt(vector[0])
		subject.y += parseInt(vector[1])
		true

	
	toJSON: (id) ->
		# For now the only thing to return is the PCs and positions.
		elements = 
			pcs: {}
		elements.pcs[player.getName()] = player.getPos() for id, player of players
		JSON.stringify(elements)
	
	povObject: (id) ->
		elements = 
			pcs: {}
		elements.pcs[player.getName()] = [player.x, player.y] for id, player of players
		elements.map = data
		elements
	
	computeFOV: (loc1, loc2) ->
		#  ToDo: Implement ray FOV solution
		true
	

module.exports = Level