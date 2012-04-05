class Level
	MAXROWS = 999
	MAXCOLS = 999
	data = []
	data[x] = [] for x in [0..MAXROWS]
	players = {}
	downy = 0
	downx = 0
	upy = 0
	upx = 0

	arrays_equal = (a, b) ->
		not (a < b or b < a)

	digroom = (x, y, w, h) ->
		data[y-1][col] = "wall" for col in [x-1..x+w]
		data[y+h][col] = "wall" for col in [x-1..x+w]
		data[row][x-1] = "wall" for row in [y-1..y+h]
		data[row][x+w] = "wall" for row in [y-1..y+h]
		data[row][col] = "floor" for col in [x..x+w - 1] for row in [y..y+h - 1]

	digpoint = (x, y) ->
		data[y][x] = "floor"
		data[y+1][x] = "wall" if data[y+1][x] == " "
		data[y-1][x] = "wall" if data[y-1][x] == " "
		data[y][x+1] = "wall" if data[y][x+1] == " "
		data[y][x-1] = "wall" if data[y][x-1] == " "
		data[y+1][x+1] = "wall" if data[y+1][x+1] == " "
		data[y-1][x-1] = "wall" if data[y-1][x-1] == " "
		data[y-1][x+1] = "wall" if data[y-1][x+1] == " "
		data[y+1][x-1] = "wall" if data[y+1][x-1] == " "

	constructor: (options, saved) ->
		if not options.generate
			# We're loading from a db
			data[row][col] = " " for row in [0..MAXROWS] for col in [0..MAXROWS]
			data[tile[0]][tile[1]] = "wall" for tile in saved.data["wall"]
			data[tile[0]][tile[1]] = "floor" for tile in saved.data["floor"]
			data[tile[0]][tile[1]] = "upstair" for tile in saved.data["upstair"]
			data[tile[0]][tile[1]] = "downstair" for tile in saved.data["downstair"]
			downy = saved.downstair[0]
			downx = saved.downstair[1]
			upy = saved.upstair[0]
			upx = saved.upstair[1]
		else
			# Time to generate a random level...
			# Random range = Math.floor(Math.random() * (to-from+1) + from)
			data[row][col] = " " for row in [0..MAXROWS] for col in [0..MAXROWS]
			firstroomx = Math.floor(Math.random() * 10) + 5
			firstroomy = Math.floor(Math.random() * 10) + 5
			roomw = Math.floor(Math.random() * 10) + 5 # Get a random height and width between 5 and 15
			roomh = Math.floor(Math.random() * 10) + 5
			digroom firstroomx, firstroomy, roomw, roomh, data
			room_track = []
			room_track.push [firstroomx, firstroomy, roomh, roomw]
			# Now push rooms off of the origin room.
			for rooms in [1..24]
				valid = false
				until valid
					console.log "Trying..."
					workingroom = Math.floor(Math.random() * room_track.length) # Pick a room from the existing rooms at random.
					roomw = Math.floor(Math.random() * 10) + 5 # Get a random height and width between 5 and 15
					roomh = Math.floor(Math.random() * 10) + 5
					exitdigs = []
					exitlength = Math.floor(Math.random() * 4) + 7
					# rand 1-4 for side of room then rand size of that wall for entrance.
					switch (Math.floor Math.random() * 4) + 1
						when 1
							exitx = (Math.floor Math.random() * room_track[workingroom][3]) + room_track[workingroom][0] # Pick a spot on the north wall
							exity = room_track[workingroom][1] - 1
							startx = exitx - (Math.floor Math.random() * roomw)
							starty = exity - roomh - exitlength - 1
							# exitdigs = [[exitx, exity], [exitx, exity-1], [exitx, exity-2]]
							exitdigs.push [exitx, exity - iter] for iter in [0..exitlength+1]
							console.log "North: " + startx + ", " + starty + " " + roomw + " x " + roomh
						when 2
							exitx = room_track[workingroom][0] + room_track[workingroom][3] # Pick a spot on the east wall
							exity = (Math.floor Math.random() * room_track[workingroom][2]) + room_track[workingroom][1]
							startx = exitx + exitlength
							starty = exity - (Math.floor Math.random() * roomh)
							# exitdigs = [[exitx, exity], [exitx+1, exity], [exitx+2, exity]]
							exitdigs.push [exitx + iter, exity] for iter in [0..exitlength+1]
							console.log "East: " + startx + ", " + starty + " " + roomw + " x " + roomh
						when 3
							exitx = (Math.floor Math.random() * room_track[workingroom][3]) + room_track[workingroom][0] # Pick a spot on the south wall
							exity = room_track[workingroom][1] + room_track[workingroom][2]
							startx = exitx - (Math.floor Math.random() * roomw)
							starty = exity + exitlength
							# exitdigs = [[exitx, exity], [exitx, exity+1], [exitx, exity+2]]
							exitdigs.push [exitx, exity + iter] for iter in [0..exitlength+1]
							console.log "South: " + startx + ", " + starty + " " + roomw + " x " + roomh
						when 4
							exitx = room_track[workingroom][0] - 1# Pick a spot on the west wall
							exity = (Math.floor Math.random() * room_track[workingroom][3]) + room_track[workingroom][1]
							startx = exitx - roomw - exitlength - 1
							starty = exity - (Math.floor Math.random() * roomh)
							# exitdigs = [[exitx, exity], [exitx-1, exity], [exitx-2, exity]]
							exitdigs.push [exitx - iter, exity] for iter in [0..exitlength+1]
							console.log "West: " + startx + ", " + starty + " " + roomw + " x " + roomh
					valid = true
					if starty > 0 and startx > 0 and starty + roomh <= MAXROWS and startx + roomw <= MAXCOLS
						for row in [starty..starty + roomh]
							for col in [startx..startx + roomw]
								unless data[row][col] == " "
									valid = false
									row = starty+roomh+1
									col = startx+roomw+1
									console.log "Failure: Room collision!"
					else
						valid = false
						console.log "Failure: Room out of bounds!"
				digroom startx, starty, roomw, roomh
				# digpoint exitdigs[0][0], exitdigs[0][1]
				# digpoint exitdigs[1][0], exitdigs[1][1]
				# digpoint exitdigs[2][0], exitdigs[2][1]
				digpoint thispoint[0], thispoint[1] for thispoint in exitdigs
				room_track.push [startx, starty, roomh, roomw]
			stairrow = Math.floor Math.random() * MAXROWS
			staircol = Math.floor Math.random() * MAXCOLS
			until donedown
				if data[stairrow][staircol] == "floor"
					data[stairrow][staircol] = "downstair"
					downy = stairrow
					downx = staircol
					donedown = true
				stairrow = Math.floor Math.random() * MAXROWS
				staircol = Math.floor Math.random() * MAXCOLS
			stairrow = Math.floor Math.random() * MAXROWS
			staircol = Math.floor Math.random() * MAXCOLS
			until doneup
				if data[stairrow][staircol] == "floor"
					data[stairrow][staircol] = "upstair"
					upy = stairrow
					upx = staircol
					doneup = true
				stairrow = Math.floor Math.random() * MAXROWS
				staircol = Math.floor Math.random() * MAXCOLS

	save: (levelCollection, depth) ->
		terrain =
			"wall":[]
			"floor":[]
			"upstair":[]
			"downstair":[]
		for row in [0..MAXROWS]
			for col in [0..MAXROWS]
				terrain[data[row][col]].push([row, col]) if data[row][col] isnt " "
		updatehash = 
			dlvl: depth
			data: terrain
			downstair: [downy, downx]
			upstair: [upy, upx]
		levelCollection.update {dlvl: depth}, {$set: updatehash}, {safe: true, upsert: true}, (err) ->
			if err
				console.log err
			else
				console.log "Saved level: " + depth

	addPlayer: (id, player) ->
		if player.x == -1 or player.y == -1 or data[player.y][player.x] != "floor"
			player.x = upx
			player.y = upy
		players[id] = player
		
	movePlayer: (socketid, vector) ->
		subject = players[socketid]
		currentx = subject.x
		currenty = subject.y
		if currentx + parseInt(vector[0]) < 0 or currentx + parseInt(vector[0]) > MAXROWS then return false
		if currenty + parseInt(vector[1]) < 0 or currenty + parseInt(vector[1]) > MAXCOLS then return false
		if data[currenty + parseInt(vector[1])][currentx + parseInt(vector[0])] not in ["floor","upstair","downstair"] then return false
		subject.x += parseInt(vector[0])
		subject.y += parseInt(vector[1])
		true
	
	povObject: (id) ->
		vision = 8 # How far can a PC see
		radian = 0
		subject = players[id]
		elements = 
			pcs: {}
			terrain:
				"wall":[]
				"floor":[]
				"upstair":[]
				"downstair":[]
				" ":[]
		if players[id]
			while radian <= 2 * Math.PI # Walk a circle around the character casting rays to the vision distance. Stop at walls and record what he can see.
				centerx = players[id].x + .5
				centery = players[id].y + .5
				xmove = Math.cos(radian)
				ymove = Math.sin(radian)
				wallbug = false
				for dist in [1..vision]
					centerx += xmove
					centery += ymove
					break if centerx > MAXCOLS or centery > MAXCOLS or centerx < 0 or centery < 0
					presensecheck = (arrays_equal item, [Math.floor(centery), Math.floor(centerx)] for item in elements.terrain[data[Math.floor centery][Math.floor centerx]])
					elements.terrain[data[Math.floor centery][Math.floor centerx]].push([Math.floor(centery), Math.floor(centerx)]) if presensecheck.indexOf(true) == -1
					for targetid, checking of players
						elements.pcs[checking.getName()] = [checking.x, checking.y, targetid] if checking.x == Math.floor(centerx) and checking.y == Math.floor(centery)
					if data[Math.floor centery][Math.floor centerx] == "wall" # We found a wall, checking the surrounding walls to see if we're caught on the wall bug
						nextinrayx = centerx + xmove
						nextinrayy = centery + ymove
						if data[Math.floor nextinrayy][Math.floor nextinrayx] == "wall" # Next tile the ray would hit is a wall too, so we might be wall bugging
							directiony = centery - nextinrayy
							directionx = centerx - nextinrayx
							wallbug = true if Math.abs(directiony) == 1 and Math.abs(directionx) == 1 # If the ray is going diagonal we can't be wall bugging, right?
							if Math.abs directiony == 1 # Room should be horizontal to the tile in question
								wallbug = true if data[Math.floor centery][Math.floor centerx + 1] == "floor" or data[Math.floor centery][Math.floor centerx - 1] == "floor"
							if Math.abs directionx == 1 # Room should be vertical to the tile in question
								wallbug = true if data[Math.floor centery + 1][Math.floor centerx] == "floor" or data[Math.floor centery - 1][Math.floor centerx] == "floor"
						break unless wallbug
						wallbug = false
				radian += .025
		elements.you = [subject.x, subject.y] # The player knows his own location, presumeably...
		elements

	playerLogOut: (id) ->
		delete players[id]

module.exports = Level