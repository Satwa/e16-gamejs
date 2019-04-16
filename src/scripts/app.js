const CELL_SIZE = 64
const SCALE = .6
const TICK = 100
const AUTHORIZED_TILES = [0, 5, 6]
const CAN_EXPLOSE_TILES = [0, 1]
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
    game.addPlayer("Emmanuel", "0")

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
        }
    })

    updater = setInterval(() => {
        ELAPSED += TICK
        game.update()
    }, TICK)
})



// clearInterval(updater)