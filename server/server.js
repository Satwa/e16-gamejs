const io = require("socket.io")(5042)
const fs = require('fs')


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
    let currentUser = socket, currentRoom
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

    socket.on('forcestart', function(){
        if(currentUser.id == rooms[currentRoom].players[0].name){
            io.to(currentRoom).emit("started")
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