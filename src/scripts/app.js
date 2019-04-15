let game = new Game()

let updater = setInterval(() => {
    game.update()
}, 100)

// clearInterval(updater)