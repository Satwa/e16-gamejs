class Game{

    constructor(){
        this.map = new Map()
        this.players = []
        this.items = []

        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
    }

    addPlayer(name, sprite){
        this.players.push(new Character(name, sprite, this.map.data.map))
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
                        [matrixX - 3, matrixY],
                        [matrixX - 2, matrixY],
                        [matrixX - 1, matrixY],
                        [matrixX + 1, matrixY],
                        [matrixX + 2, matrixY],
                        [matrixX + 3, matrixY],
                        [matrixX, matrixY - 3],
                        [matrixX, matrixY - 2],
                        [matrixX, matrixY - 1],
                        [matrixX, matrixY + 1],
                        [matrixX, matrixY + 2],
                        [matrixX, matrixY + 3]
                    ] // If we meet a wall, we shouldn't look behind
                }

                if(item.type !== 2){
                    console.log("not a particle")
                    // It's a bomb or a megabomb
                    for (let i = 0; i < positions.length; i++) {
                        let localX = positions[i][0],
                            localY = positions[i][1]
                        
                        if(localX < 0 || localY < 0) return

                        if (this.map.isBreakableAt(localX, localY)) { // Check if block is breakable 
                            this.map.data.map[localY][localX] = 0 // TODO: Random bonus
                            this.items.push(new Particle(localX, localY))
                        }

                        for (let player of this.players) {
                            let playerPosition = [player.x / CELL_SIZE, player.y / CELL_SIZE]
                            if (positions.find(comparePosition(playerPosition)) !== undefined && !tookDamage) {
                                console.log("User lost one life")
                                tookDamage = true
                                player.health--
                                if (player.health === 0) {
                                    alert("Player " + player.name + " died") // TODO: handle true death
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
