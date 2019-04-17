const CELL_SIZE = 64
const SCALE = .7
const TICK = 100
const AUTHORIZED_TILES = [0, 5, 6]
const CAN_EXPLOSE_TILES = [0, 1, 5, 6]

<<<<<<< HEAD
// This is for playing locally 1v1
let ELAPSED = 0
let game = new Game(0),
    updater
=======
let game, updater, ELAPSED = 0, socket, whoAmI

// loadGameLocally()
>>>>>>> 0a43b5fcd1ab4f50923fb460b6c3040bf16b7d2d

function contains(arr, element) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === element) return true
    }
    return false
}

function generateRoomId(){
    const hexa = "ABCDEF0123456789"
    let generated = ""
    for (let i = 0; i < 5; i++) {
        generated += hexa.charAt(Math.floor(Math.random() * hexa.length))
    }
    return generated
}

function forceRoomStart(){
    socket.emit("forcestart")
}


function prepareMultiplayer(room){
    socket = io('http://localhost:5042')

    socket.emit("joinroom", { room: room })

    socket.on("loadroom", function(room) {
        console.log(room)
        game = new Game(room.maptype)
        game.map.loadMap().then(function() {
            game.update()

            for(let [index, player] of room.players.entries()){
                game.addPlayer(player.name, index, player.x * CELL_SIZE, player.y * CELL_SIZE)
            }
            whoAmI = room.players.length - 1

            game.update()
        })
    })
    
    socket.on("newplayer", function(data) {
        console.log("New player to add")
        game.addPlayer(data.name, game.players.length, data.x * CELL_SIZE, data.y * CELL_SIZE)
        
        game.update()
    })
    
    socket.on("started", function() {
        loadGameOnline()

        console.log("Started")

        updater = setInterval(() => {
            ELAPSED += TICK
            game.update()
        }, TICK)
    })
}

// in a multiplayer context
function loadGameOnline() {

    socket.on("playermove", function (data) {
        switch (data.move.axis) {
            case 'x':
                game.players[game.getPlayerByName(data.player_name)].moveX(data.move.factor)
                break
            case 'y':
                game.players[game.getPlayerByName(data.player_name)].moveY(data.move.factor)
                break
        }
    })

    document.addEventListener("keydown", (e) => {
        e.preventDefault()

        switch (e.key) { // TODO: User won't always be players[1]
            case "ArrowUp":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'y',
                        factor: -1
                    })
                }
                break
            case "ArrowDown":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'y',
                        factor: 1
                    })
                }
                break
            case "ArrowLeft":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'x',
                        factor: -1
                    })
                }
                break
            case "ArrowRight":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'x',
                        factor: 1
                    })
                }
                break
            case " ":
                if (game.players[whoAmI].canDropBomb()) {
                    game.items.push(new Bomb(game.players[whoAmI].bombType, game.players[whoAmI].x, game.players[whoAmI].y))
                    game.players[whoAmI].setBombType(0)
                }
                break
        }
    })
}

// in a singleplayer context
function loadGameLocally(){
    game = new Game()
    game.map.loadMap().then(() => {
        game.addPlayer("Grégoire", 2, CELL_SIZE, CELL_SIZE)
        game.addPlayer("Léa", 7, CELL_SIZE * (game.map.data.map[0].length - 2), CELL_SIZE * (game.map.data.map.length - 2))

        document.addEventListener("keydown", (e) => {
            e.preventDefault()

            switch(e.key){
                case "ArrowUp":
                    if(game.players[1].idle){
                        game.players[1].moveY(-1)
                    }
                    break
                case "ArrowDown":
                    if(game.players[1].idle){
                        game.players[1].moveY()
                    }
                    break
                case "ArrowLeft":
                    if(game.players[1].idle){
                        game.players[1].moveX(-1)
                    }
                    break
                case "ArrowRight":
                    if(game.players[1].idle){
                        game.players[1].moveX()
                    }
                    break
                case "Enter":
                    if(game.players[1].canDropBomb()){
                        game.items.push(new Bomb(game.players[1].bombType, game.players[1].x, game.players[1].y))
                        game.players[1].setBombType(0)
                    }
                    break
                case "z":
                    if (game.players[0].idle) {
                        game.players[0].moveY(-1)
                    }
                    break
                case "s":
                    if (game.players[0].idle) {
                        game.players[0].moveY()
                    }
                    break
                case "q":
                    if (game.players[0].idle) {
                        game.players[0].moveX(-1)
                    }
                    break
                case "d":
                    if (game.players[0].idle) {
                        game.players[0].moveX()
                    }
                    break
                case "r":
                    if (game.players[0].canDropBomb()) {
                        game.items.push(new Bomb(game.players[0].bombType, game.players[0].x, game.players[0].y))
                        game.players[0].setBombType(0)
                    }
                    break
            }
        })

        updater = setInterval(() => {
            ELAPSED += TICK
            game.update()
        }, TICK)
    })
}

// clearInterval(updater)