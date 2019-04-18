class Game{

    constructor(maptype = Math.floor(Math.random() * 12), multiplayer = false){
        this.map = new Map(maptype)
        this.players = []
        this.items = []

        this.multiplayer = multiplayer

        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
    }

    addPlayer(name, sprite, x, y){
        this.players.push(new Character(name, sprite, this.map.data.map, x, y))
    }

    getPlayerByName(name){
        for(let [index, player] of this.players.entries()){
            if(player.name == name) return index
        }
        return -1
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.map.render()

        // This function allows us to find an array in an an array of arrays (for position)
        function comparePosition(playerPos) {
            return pos => (pos[0] === playerPos[0] && pos[1] === playerPos[1])
        }

        for(let [index, item] of this.items.entries()){
            item.render()
            if(item.readyToDelete){
                let matrixX = item.x / CELL_SIZE,
                    matrixY = item.y / CELL_SIZE,
                    tookDamage = false,
                    positions = []

                if(item.type === 0) { // Normal bomb (radius=1)
                    item.exploded = true

                    positions = [
                        [matrixX, matrixY],
                        [matrixX - 1, matrixY],
                        [matrixX + 1, matrixY],
                        [matrixX, matrixY - 1],
                        [matrixX, matrixY + 1]
                    ]

                } else if(item.type === 1) { // Mega bomb (radius=3)
                    item.exploded = true

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
                }

                if(item.type < 2){
                    // It's a bomb or a megabomb

                    for (let i = 0; i < positions.length; i++) {
                        let localX = positions[i][0],
                            localY = positions[i][1],
                            shouldNotBreak = [] // TODO: avoid breaking behind a wall

                        
                        if(localX >= 0 && localY >= 0 && localY < this.map.data.map.length && localX < this.map.data.map[0].length){
                            if(this.map.isBreakableAt(localX, localY)) { // Check if block is breakable 
                                if (this.map.data.map[localY][localX] !== 0 && !this.multiplayer){
                                    let probability = Math.floor(Math.random() * 60)
                                    if(probability < 10){
                                        this.map.data.map[localY][localX] = 5 // Megabomb
                                        
                                        setTimeout(() => { // Reset case after a while
                                            this.map.data.map[localY][localX] = 0
                                        }, TICK * 50)
                                    }else if(probability < 58){
                                        this.map.data.map[localY][localX] = 0 // No bonus
                                    }else{
                                        this.map.data.map[localY][localX] = 6 // Bonus-Malus
                                        setTimeout(() => { // Reset case after a while
                                            this.map.data.map[localY][localX] = 0
                                        }, TICK * 50)
                                    }
                                }
                                this.items.push(new Particle(localX, localY))
                            }
                            
                            let isPlayerDeadAt = [], deads = 0
                            for (let [index, player] of this.players.entries()) {
                                let playerPosition = [player.x / CELL_SIZE, player.y / CELL_SIZE]
                                if (positions.find(comparePosition(playerPosition)) !== undefined && !tookDamage) {
                                    tookDamage = true
                                    item.type === 0 ? player.setHealth(-1) : player.setHealth(-3) // If bomb only life-1 / if megabomb instant-kill
                                }
                                
                                if (player.health > 0) {
                                    isPlayerDeadAt.push(0)
                                    console.log("life greater than 0")
                                } else {
                                    isPlayerDeadAt.push(1)
                                    console.log("life lower than 1")
                                    deads++
                                }
                                if (deads === this.players.length - 1) {
                                    console.log(deads)
                                    console.log(isPlayerDeadAt)
                                    websiteShowEnd(isPlayerDeadAt.indexOf(1) + 1, this.multiplayer)
                                }
                            }
                        }
                    }
                }

                this.items.splice(index, 1)
            }
        }

        for (let player of this.players) {
            player.render()
        }
    }

}
