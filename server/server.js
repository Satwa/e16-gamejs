const io = require("socket.io")(5042)
const fs = require('fs')

const CELL_SIZE = 64
const MAP_LENGTH = 2

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
const mapsFiles = fs.readdirSync('./maps/')
for(mapName of mapsFiles){
    const mapFile = String(fs.readFileSync('./maps/' + mapName))

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

        if(rooms[data.room]){
            let positions = [
                [1, 1],
                [rooms[data.room].map[0].length - 2, 1],
                [rooms[data.room].map[0].length - 2, rooms[data.room].map.length - 2],
                [1, rooms[data.room].map.length - 2],
            ]
            // Room exists
            if(rooms[data.room].players.length != 4 && rooms[data.room].started == false){ // If lobby not full 
                // Add player
                playerPos = rooms[data.room].players.length
                rooms[data.room].players.push({
                    x: positions[rooms[data.room].players.length][0],
                    y: positions[rooms[data.room].players.length][1],
                    name: currentUser.id,
                    health: 3,
                    bombType: 0,
                    isInvincible: false
                })
            }
        }else{
            let randomMapType = Math.floor(Math.random() * MAP_LENGTH)
            rooms[data.room] = {
                started: false,
                players: [],
                maptype: randomMapType,
                map: maps[randomMapType].map
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
                bombType: 0,
                isInvincible: false
            })
        }
        socket.join(data.room)
        socket.emit("loadroom", rooms[currentRoom])
        socket.broadcast.to(currentRoom).emit('newplayer', rooms[data.room].players[rooms[data.room].players.length - 1])
    })

    /*
        data:
            - axis
            - factor
    */
    socket.on("askformove", function(data){
        if(rooms[currentRoom].started){ 
            // Test place on map
            let nextCellX = rooms[currentRoom].players[playerPos].x,
                nextCellY = rooms[currentRoom].players[playerPos].y
            if(data.axis == "y"){
                nextCellY = nextCellY + data.factor
            }else if(data.axis == "x"){
                nextCellX = nextCellX + data.factor
            }
            if(rooms[currentRoom].map[nextCellY][nextCellX] === 0){
                rooms[currentRoom].players[playerPos].x = nextCellX
                rooms[currentRoom].players[playerPos].y = nextCellY
                io.to(currentRoom).emit('playermove', { player_name: currentUser.id, move: { axis: data.axis, factor: data.factor } })
            }
        }
    })

    socket.on('forcestart', function(){
        if(currentUser.id == rooms[currentRoom].players[0].name){
            rooms[currentRoom].started = true
            io.to(currentRoom).emit("started")
            console.log("Room #" + currentRoom + " started")
        }
    })

    socket.on('disconnect', function () {
        console.log(players.find(compareName(socket.name)))
        if (players.find(compareName(socket.name)) !== undefined){
            delete players[players.find(compareName(socket.name))]
        }
        // players[socket.id].health = 0 // broadcast health to 0
        console.log('User left')
    })
})