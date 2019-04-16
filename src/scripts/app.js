const CELL_SIZE = 64
const SCALE = .6
const TICK = 100
const AUTHORIZED_TILES = [0, 5, 6]
const CAN_EXPLOSE_TILES = [0, 1]

// This is for playing locally 1v1
let ELAPSED = 0
let game = new Game(),
    updater

function contains(arr, element) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === element) return true
    }
    return false
}

game.map.loadMap().then(() => {
    game.addPlayer("Emmanuel", "0", CELL_SIZE, CELL_SIZE)
    game.addPlayer("Léa", "7", CELL_SIZE * 13, CELL_SIZE * 6)

    document.addEventListener("keydown", (e) => {
        e.preventDefault()
        
        switch(e.key){
            case "ArrowUp":
                if(game.players[0].idle){
                    game.players[0].moveY(-1)
                }
                break
            case "ArrowDown":
                if(game.players[0].idle){
                    game.players[0].moveY()
                }
                break
            case "ArrowLeft":
                if(game.players[0].idle){
                    game.players[0].moveX(-1)
                }
                break
            case "ArrowRight":
                if(game.players[0].idle){
                    game.players[0].moveX()
                }
                break
            case " ":
                if(game.players[0].canDropBomb()){
                    game.items.push(new Bomb(game.players[0].bombType, game.players[0].x, game.players[0].y))
                }
                break
            case "z":
                if (game.players[1].idle) {
                    game.players[1].moveY(-1)
                }
                break
            case "s":
                if (game.players[1].idle) {
                    game.players[1].moveY()
                }
                break
            case "q":
                if (game.players[1].idle) {
                    game.players[1].moveX(-1)
                }
                break
            case "d":
                if (game.players[1].idle) {
                    game.players[1].moveX()
                }
                break
            case "r":
                if (game.players[1].canDropBomb()) {
                    game.items.push(new Bomb(game.players[1].bombType, game.players[1].x, game.players[1].y))
                }
                break
        }
    })

    updater = setInterval(() => {
        ELAPSED += TICK
        game.update()
    }, TICK)
})



// clearInterval(updater)