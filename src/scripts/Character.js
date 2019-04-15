class Character {
    
    constructor(name, sprite, map){
        this.name = name
        this.sprite = sprite
        this.stuff = null
        
        this.map = map

        this.idle = true
        
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
        this.idle = false
        let i = 0
        let move = () => {
            this.x = this.x + 1 * factor
            factor == -1 ? this.tile.setSrcY(2) : this.tile.setSrcY(0) // en fonction des sprites
            i++
            if (i != CELL_SIZE) {
                setTimeout(() => {
                    move()
                }, 5)
            }else{
                this.idle = true
            }
        }
        move()

        if (this.tile.srcX < 0 || this.tile.srcX > this.tile.height) {
            
        }
        // est-ce que la case suivante est libre ?
    }

    moveY(factor = 1) {
        this.idle = false
        let i = 0
        let move = () => {
            this.y = this.y + 1 * factor
            
            i++
            factor == -1 ? this.tile.setSrcY(3) : this.tile.setSrcY(1) // en fonction des sprites
            
            if (i != CELL_SIZE) {
                setTimeout(() => {
                    move()
                }, 5)
            } else {
                this.idle = true
            }
        }
        move()

        if (this.tile.srcY < 0 || this.tile.srcY > this.tile.height) {
            
        }
        // est-ce que la case suivante est libre ?
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
