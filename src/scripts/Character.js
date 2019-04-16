class Character {
    
    constructor(name, sprite, map){
        this.name = name
        this.sprite = sprite
        
        this.map = map
        
        this.idle = true
        this.health = 3
        this.isInvincible = false
        this.hasSlowness = false
        this.bombType = 0 // 0 default / 1 megabomb
        this.lastBombSent = 0 // compare either lastTick or timestamp or hasPreviousBombExploded
        
        this.x = CELL_SIZE
        this.y = CELL_SIZE

        // All sprites have the same pattern [WIP]
        const spriteHeight = 330,
              spriteWidth = 192,
              row = 5,
              col = 3
        
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
                }, this.hasSlowness ? 5 : 2)
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
                }, this.hasSlowness ? 5 : 2)
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
    
    setInvincible(){
        this.isInvincible = true
        setTimeout(() => {
            this.isInvincible = false
        }, 3000) // Invincibility for 3s
    }

    setSlowness(){
        this.hasSlowness = true
        setTimeout(() => {
            this.hasSlowness = false
        }, 2000)
    }

    canDropBomb(){
        if(this.lastBombSent != 0 && ELAPSED < this.lastBombSent + TICK * 10){
            return false
        }
        this.lastBombSent = ELAPSED
        return true
    }

    // useStuff(){
    //     if(this.stuff){
    //         // User has stuff
    //         // TODO: Check what is it and play behavior
    //     }else{
    //         return false
    //     }
    // }

    // setStuff(tileId){ // it overrides for now, TODO: should we refuse any other object?
    //     this.stuff = tileId //is it tileId or instance of a class?
    // }

    render(){
        this.tile.render(this.x, this.y, !this.idle)
    }
    
}

/*
    - red bomb damage = -1
    - black bomb damage = -3
*/
