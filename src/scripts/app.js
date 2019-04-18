const CELL_SIZE = 64
const SCALE = 1/2
const TICK = 100
const AUTHORIZED_TILES = [0, 5, 6]
const CAN_EXPLOSE_TILES = [0, 1, 5, 6]

let game, updater, ELAPSED = 0, socket, whoAmI

// loadGameLocally()

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


function prepareMultiplayer(roomParam){
    socket = io('https://e16-gameserver.herokuapp.com') // 'http://localhost:5042'

    socket.emit("joinroom", { room: roomParam })

    socket.on("loadroom", function(room) {
        
        websiteResetMenu(roomParam)

        game = new Game(room.maptype, true)
        game.map.loadMap().then(function() {
            for(let [index, player] of room.players.entries()){
                game.addPlayer(player.name, index, player.x * CELL_SIZE, player.y * CELL_SIZE)
                game.players[game.getPlayerByName(player.name)].health = player.health // Update player that left before I arrive
            }
            whoAmI = room.players.length - 1

            loadGameOnline()
            game.map.data.map = room.map.slice()
            updater = setInterval(() => {
                ELAPSED += TICK
                game.update()
            }, TICK)
        })
    })
}

// in a multiplayer context
function loadGameOnline() {
    socket.on("newplayer", function (data) {
        console.log("New player to add")
        game.addPlayer(data.name, game.players.length, data.x * CELL_SIZE, data.y * CELL_SIZE)
    })

    socket.on("started", function () {
        console.log("Started")
        ELAPSED = 0
    })
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

    socket.on("bombdrop", function(data){
        game.items.push(new Bomb(data.type, data.x * CELL_SIZE, data.y * CELL_SIZE))
    })

    socket.on("mapedit", function(data){
        game.map.data = { map: data.map.slice() }
        for(let player of game.players){
            player.map = data.map.slice()
        }
    })

    socket.on("playerstatus", function(data){
        for(let player of data.players){
            game.players[game.getPlayerByName(player.name)].health = player.health
            game.players[game.getPlayerByName(player.name)].bombs = player.bombs
            game.players[game.getPlayerByName(player.name)].bombs = player.bombs
            game.players[game.getPlayerByName(player.name)].isInvincible = player.isInvincible
        }
    })

    document.addEventListener("keydown", (e) => {
        e.preventDefault()

        switch (e.key) { // TODO: User won't always be players[1]
            case "z":
            case "ArrowUp":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'y',
                        factor: -1
                    })
                }
                break
            case "s":
            case "ArrowDown":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'y',
                        factor: 1
                    })
                }
                break
            case "q":
            case "ArrowLeft":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'x',
                        factor: -1
                    })
                }
                break
            case "d":
            case "ArrowRight":
                if (game.players[whoAmI].idle) {
                    socket.emit("askformove", {
                        axis: 'x',
                        factor: 1
                    })
                }
                break
            case "Enter":
                if (game.players[whoAmI].canDropBomb() && game.players[whoAmI].bombs > 0) {
                    socket.emit("askforbomb", {
                        type: 1,
                        x: game.players[whoAmI].x / 64,
                        y: game.players[whoAmI].y / 64
                    }, function () {
                        game.players[whoAmI].bombs--
                    })
                }
                break
            case " ":
                if (game.players[whoAmI].canDropBomb()) {
                    socket.emit("askforbomb", {
                        type: 0,
                        x: game.players[whoAmI].x / 64,
                        y: game.players[whoAmI].y / 64
                    })
                }
                break
        }
    })
}

// in a singleplayer context
function loadGameLocally(maptype = 0){
    game = new Game(maptype)
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
                        game.items.push(new Bomb(0, game.players[1].x, game.players[1].y))
                    }
                    break
                case "m":
                    if (game.players[1].canDropBomb() && game.players[1].bombs > 0){
                        game.items.push(new Bomb(1, game.players[1].x, game.players[1].y))
                        game.players[1].bombs--
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
                case "e": // This drops a normal bomb
                    if (game.players[0].canDropBomb()) {
                        game.items.push(new Bomb(0, game.players[0].x, game.players[0].y))
                    }
                    break
                case "r": // This drops a megabomb
                    if (game.players[0].canDropBomb() && game.players[0].bombs > 0) {
                        game.items.push(new Bomb(1, game.players[0].x, game.players[0].y))
                        game.players[0].bombs--
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
