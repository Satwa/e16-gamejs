const http = require('http')

const io = require("socket.io")(process.env.PORT) // process.env.PORT || 5042
const fs = require('fs')

const TICK = 100
const AUTHORIZED_TILES = [0, 5, 6]
const CAN_EXPLOSE_TILES = [0, 1, 5, 6]

let players = [],
    rooms = {},
    maps = []

/*
    room [
        status: 0 waiting / 1 playing
        players: [p1, p2, p3, p4],
        map: n,
        matrix: [[...], ...]
    ]
*/

// Preload all maps
const mapsFiles = fs.readdirSync('./server/maps/')
const MAP_LENGTH = mapsFiles.length
for(mapName of mapsFiles){
    const mapFile = String(fs.readFileSync('./server/maps/' + mapName))

    maps.push(JSON.parse(mapFile))
}

function compareName(socketId) {
    return player => player.name == socketId
}


io.sockets.on("connection", function(socket) {
    let currentUser = socket, currentRoom, playerPos
    console.log("New connection from " + currentUser.handshake.address)
    
    socket.on("joinroom", function(data) {
        currentRoom = data.room

        if(rooms[data.room]){ // Room exists
            let positions = [
                [1, 1],
                [rooms[data.room].map[0].length - 2, 1],
                [rooms[data.room].map[0].length - 2, rooms[data.room].map.length - 2],
                [1, rooms[data.room].map.length - 2],
            ]

            if(rooms[data.room].players.length != 4 && !rooms[data.room].started){ // If lobby not full 
                // Add player
                playerPos = rooms[data.room].players.length
                rooms[data.room].players.push({
                    x: positions[rooms[data.room].players.length][0],
                    y: positions[rooms[data.room].players.length][1],
                    name: currentUser.id,
                    health: 3,
                    bombs: 0,
                    isInvincible: false
                })
                socket.broadcast.to(currentRoom).emit('newplayer', rooms[data.room].players[rooms[data.room].players.length - 1])
                
                if (rooms[data.room].players.length === 4 && !rooms[data.room].started) { // auto-start
                    rooms[currentRoom].started = true
                    io.in(currentRoom).emit("started")
                }
            }else{
                rooms[data.room].spectators.push(currentUser.id)
            }
        }else{
            let randomMapType = Math.floor(Math.random() * MAP_LENGTH)
            rooms[data.room] = {
                started: false,
                players: [],
                maptype: randomMapType,
                map: maps[randomMapType].map,
                spectators: []
            }

            let positions = [
                [1, 1],
                [rooms[data.room].map[0].length - 2, 1],
                [rooms[data.room].map[0].length - 2, rooms[data.room].map.length - 2],
                [1, rooms[data.room].map.length - 2],
            ]

            playerPos = rooms[data.room].players.length
            rooms[data.room].players.push({
                x: positions[rooms[data.room].players.length][0],
                y: positions[rooms[data.room].players.length][1],
                name: currentUser.id,
                health: 3,
                bombs: 0,
                isInvincible: false
            })

            if (rooms[data.room].players.length == 4){
                // Launch the game if 4 players are here
                rooms[currentRoom].started = true
                io.in(currentRoom).emit("started")
                console.log("Room #" + currentRoom + " started")
            }
        }
        socket.join(data.room)
        socket.emit("loadroom", rooms[currentRoom])
    })

    socket.on('forcestart', function () {
        if (!rooms[currentRoom]) return
        if (currentUser.id == rooms[currentRoom].players[0].name) {
            rooms[currentRoom].started = true
            io.in(currentRoom).emit("started")
            console.log("Room #" + currentRoom + " started")
        }
    })

    /*
        data:
            - axis
            - factor
    */
    socket.on("askformove", function(data){
        if(!rooms[currentRoom]) return
        if(rooms[currentRoom].started && !rooms[currentRoom].spectators.includes(currentUser.id)){ 
            // Test place on map
            let nextCellX = rooms[currentRoom].players[playerPos].x,
                nextCellY = rooms[currentRoom].players[playerPos].y

            if(data.axis == "y"){
                nextCellY = nextCellY + data.factor
            }else if(data.axis == "x"){
                nextCellX = nextCellX + data.factor
            }
            
            if (AUTHORIZED_TILES.includes(rooms[currentRoom].map[nextCellY][nextCellX]) && rooms[currentRoom].players[playerPos].health > 0){
                if (rooms[currentRoom].map[nextCellY][nextCellX] === 5){
                    rooms[currentRoom].map[nextCellY][nextCellX] = 0
                    rooms[currentRoom].players[playerPos].bombs++
                    io.in(currentRoom).emit('playerstatus', {
                        players: rooms[currentRoom].players
                    })

                    io.in(currentRoom).emit('mapedit', {
                        map: rooms[currentRoom].map
                    })
                } else if (rooms[currentRoom].map[nextCellY][nextCellX] === 6){
                    rooms[currentRoom].map[nextCellY][nextCellX] = 0
                    rooms[currentRoom].players[playerPos].isInvincible = true

                    setTimeout(() => {
                        rooms[currentRoom].players[playerPos].isInvincible = false
                        io.in(currentRoom).emit('playerstatus', {
                            players: rooms[currentRoom].players
                        })
                    }, TICK * 50)

                    io.in(currentRoom).emit('playerstatus', {
                        players: rooms[currentRoom].players
                    })

                    io.in(currentRoom).emit('mapedit', {
                        map: rooms[currentRoom].map
                    })
                }
                rooms[currentRoom].players[playerPos].x = nextCellX
                rooms[currentRoom].players[playerPos].y = nextCellY
                io.in(currentRoom).emit('playermove', { 
                    player_name: currentUser.id, 
                    move: { 
                        axis: data.axis, 
                        factor: data.factor 
                    } 
                })
            }
        }
    })

    socket.on("askforbomb", function(data){
        if (!rooms[currentRoom]) return

        function comparePosition(playerPos) {
            return pos => (pos[0] === playerPos[0] && pos[1] === playerPos[1])
        }

        function isBreakableAt(mx, my){ // stands for matrixX and matrixY
            if (mx > rooms[currentRoom].map[0].length - 1 || my > rooms[currentRoom].map.length - 1 || mx < 0 || my < 0) return false
            if (!rooms[currentRoom].map[my]) return false
            return CAN_EXPLOSE_TILES.includes(rooms[currentRoom].map[my][mx])
        }

        if (rooms[currentRoom].started && !rooms[currentRoom].spectators.includes(currentUser.id)) {
            setTimeout(() => { // This logic is from the client-side
                let matrixX = data.x,
                    matrixY = data.y,
                    tookDamage = false,
                    positions = []

                if(rooms[currentRoom].players[playerPos].bombs > 0 && data.type === 1) {
                    positions = [
                        [matrixX, matrixY],
                        [matrixX - 2, matrixY],
                        [matrixX - 1, matrixY],
                        [matrixX + 1, matrixY],
                        [matrixX + 2, matrixY],
                        [matrixX, matrixY - 2],
                        [matrixX, matrixY - 1],
                        [matrixX, matrixY + 1],
                        [matrixX, matrixY + 2],
                    ]
                    rooms[currentRoom].players[playerPos].bombs--
                } else if (data.type === 0){
                    positions = [
                        [matrixX, matrixY],
                        [matrixX - 1, matrixY],
                        [matrixX + 1, matrixY],
                        [matrixX, matrixY - 1],
                        [matrixX, matrixY + 1]
                    ]
                }

                for (let i = 0; i < positions.length; i++) {
                    let localX = positions[i][0],
                        localY = positions[i][1]


                    if (localX >= 0 && localY >= 0 && localY < rooms[currentRoom].map.length && localX < rooms[currentRoom].map[0].length) {
                        if (isBreakableAt(localX, localY)) { // Check if block is breakable 
                            if (rooms[currentRoom].map[localY][localX] !== 0) {
                                let probability = Math.floor(Math.random() * 60)
                                if (probability < 10) {
                                    rooms[currentRoom].map[localY][localX] = 5 // Megabomb

                                    setTimeout(() => { // Reset case after a while
                                        rooms[currentRoom].map[localY][localX] = 0
                                        io.in(currentRoom).emit('mapedit', {
                                            map: rooms[currentRoom].map
                                        })
                                    }, TICK * 50)
                                } else if (probability < 58) {
                                    rooms[currentRoom].map[localY][localX] = 0 // No bonus
                                } else {
                                    rooms[currentRoom].map[localY][localX] = 6 // Bonus-Malus
                                    setTimeout(() => { // Reset case after a while
                                        rooms[currentRoom].map[localY][localX] = 0
                                        io.in(currentRoom).emit('mapedit', {
                                            map: rooms[currentRoom].map
                                        })
                                    }, TICK * 50)
                                }
                            }
                        }

                        for (let player of rooms[currentRoom].players) {
                            let playerPosition = [player.x, player.y]
                            if (positions.find(comparePosition(playerPosition)) !== undefined && !tookDamage) {
                                tookDamage = true
                                rooms[currentRoom].players[playerPos].bombs > 0 && data.type === 1 ? player.health = 0 : --player.health // If bomb only life-1 / if megabomb instant-kill
                            }
                        }
                    }
                }
                io.in(currentRoom).emit('playerstatus', {
                    players: rooms[currentRoom].players
                })

                io.in(currentRoom).emit('mapedit', {
                    map: rooms[currentRoom].map
                })
            }, TICK * 20)

            io.in(currentRoom).emit('bombdrop', {
                player_name: currentUser.id,
                type: rooms[currentRoom].players[playerPos].bombs > 0 && data.type === 1 ? 1 : 0,
                x: data.x,
                y: data.y
            })
        }
    })

    socket.on('disconnect', function () {
        if (!rooms[currentRoom]) return
        if(!rooms[currentRoom].spectators.includes(currentUser.id)){ // Current user is not a spectator so she/he is a player for sure
            rooms[currentRoom].players[playerPos].health = 0
            io.in(currentRoom).emit('playerstatus', {
                players: rooms[currentRoom].players
            })
        }
        console.log('User left')
    })
})