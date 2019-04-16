const CELL_SIZE = 64
const SCALE = 1/2
const TICK = 100
const AUTHORIZED_TILES = [0, 4, 5]

let game = new Game(),
    updater


game.map.loadMap().then(() => {
    game.addPlayer("Emmanuel", "test@64")

    updater = setInterval(() => {
        game.update()
    }, TICK)
})



// clearInterval(updater)