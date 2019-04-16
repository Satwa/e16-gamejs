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
        for(let [index, item] of this.items.entries()){
            item.render()
            if(item.readyToDelete){
                let matrixX = item.x / CELL_SIZE,
                    matrixY = item.y / CELL_SIZE

                if(item.type == 0){ // Normal bomb (radius=1)
                    // TODO: Add explosion animation
                    let positions = [
                        [matrixX, matrixY],
                        [matrixX - 1, matrixY],
                        [matrixX + 1, matrixY],
                        [matrixX, matrixY - 1],
                        [matrixX, matrixY + 1]
                    ]
                    for(let i = 0; i < positions.length; i++){
                        console.log(this.map.isBreakableAt(positions[i][0], positions[i][1]))
                        let localX = positions[i][0],
                            localY = positions[i][1]
                        if(this.map.isBreakableAt(localX, localY)){
                            this.map.data.map[localY][localX] = 0
                        }
                        for(let player of this.players){
                            let playerPosition = [player.x / CELL_SIZE, player.y / CELL_SIZE]
                            
                            // if()
                        }
                    }
                }else{ // Mega bomb (radius=3)
                    
                }

                this.items.splice(index, 1)
            }
        }

        for (let player of this.players) {
            player.render()
        }
    }

}
