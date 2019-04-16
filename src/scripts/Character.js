class Character {
    
    constructor(name, sprite, map){
        this.name = name
        this.sprite = sprite
        
        this.map = map
        
        this.idle = true
        this.stuff = null
        this.health = 3
        
        this.x = CELL_SIZE
        this.y = CELL_SIZE

        // All sprites have the same pattern [WIP]
        const spriteHeight = 64,
              spriteWidth = 435,
              row = 1,
              col = 8
        
        this.tile = new Tile("players/" + this.sprite + ".png", spriteWidth, spriteHeight, row, col)
    }

    moveX(factor = 1) {
        let i = 0
        let move = () => {
            this.x = this.x + 1 * factor
            factor == -1 ? this.tile.setSrcY(2) : this.tile.setSrcY(0) // according to sprite
            i++
            if (i != CELL_SIZE) {
                setTimeout(() => {
                    move()
                }, 5)
            }else{
                this.idle = true
                this.tile.currentFrame = 0
            }
        }
        const nextCellX = (this.x + CELL_SIZE * factor) / CELL_SIZE,
              nextCellY = this.y / CELL_SIZE
        if(AUTHORIZED_TILES.includes(this.map[nextCellY][nextCellX])){ // If next case is an authorized block, we do the move
            this.idle = false
            move()
        }
    }

    moveY(factor = 1) {
        let i = 0
        let move = () => {
            this.y = this.y + 1 * factor
            
            i++
            factor == -1 ? this.tile.setSrcY(3) : this.tile.setSrcY(1) // according to sprite
            
            if (i != CELL_SIZE) {
                setTimeout(() => {
                    move()
                }, 5)
            } else {
                this.idle = true
                this.tile.currentFrame = 0
            }
        }

        const nextCellX = this.x / CELL_SIZE,
              nextCellY = (this.y + CELL_SIZE * factor) / CELL_SIZE
        if (AUTHORIZED_TILES.includes(this.map[nextCellY][nextCellX])) { // If next case is an authorized block, we do the move
            this.idle = false
            move()
        }
    }
    
    render(){
        this.tile.render(this.x, this.y, !this.idle)
    }
    
}

/*
moveX()
moveY()
useStuff()
hasStuff()
render()

- health : 3
- red bomb = -1
- black bomb = -3
- stuff
- bombs
- bonus
- malus
*/
