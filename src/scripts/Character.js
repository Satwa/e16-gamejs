class Character {
    
    constructor(name, sprite, map, x = CELL_SIZE, y = CELL_SIZE){
        this.name = name
        this.sprite = sprite
        
        this.map = map
        
        this.idle = true
        this.health = 3
        this.isInvincible = false
        this.hasSlowness = false
        this.bombType = 0 // 0 default / 1 megabomb
        this.lastBombSent = 0 // compare either lastTick or timestamp or hasPreviousBombExploded
        
        this.x = x
        this.y = y

        // All sprites have the same pattern [WIP]
        const spriteHeight = 330,
              spriteWidth = 192,
              row = 5,
              col = 3
        
        this.tile = new Tile("players/" + this.sprite + ".png", spriteWidth, spriteHeight, row, col)
    }

    moveX(factor = 1) {
        if(this.health === 0) return

        let i = 0
        let move = () => {
            this.x = this.x + 2 * factor
            factor == -1 ? this.tile.setSrcY(2) : this.tile.setSrcY(0) // according to sprite
            i++
            if (i != CELL_SIZE/2) {
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
            if (this.map[nextCellY][nextCellX] === 5) {
                this.map[nextCellY][nextCellX] = 0
                this.bombType = 1
            } else if (this.map[nextCellY][nextCellX] === 6){
                console.log("Bonus-Malus")
            }
            this.idle = false
            move()
        }
    }

    moveY(factor = 1) {
        if(this.health === 0) return

        let i = 0
        let move = () => {
            this.y = this.y + 2 * factor
            
            i++
            factor == -1 ? this.tile.setSrcY(3) : this.tile.setSrcY(1) // according to sprite
            
            if (i != CELL_SIZE/2) {
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
            if (this.map[nextCellY][nextCellX] === 5) {
                this.map[nextCellY][nextCellX] = 0
                this.setBombType(1)
            } else if (this.map[nextCellY][nextCellX] === 6) {
                this.map[nextCellY][nextCellX] = 0
                this.setInvincible()
            }
            this.idle = false
            move()
        }
    }
    
    setInvincible(){
        this.isInvincible = true
        setTimeout(() => {
            this.isInvincible = false
        }, TICK * 50) // Invincibility for 5s
    }

    setSlowness(){
        this.hasSlowness = true
        setTimeout(() => {
            this.hasSlowness = false
        }, TICK * 20)
    }

    setHealth(deltaHealth){
        !this.isInvincible ? this.health += deltaHealth : this.health
    }

    setBombType(bombType){
        this.bombType = bombType
    }

    canDropBomb(){
        if(this.lastBombSent != 0 && ELAPSED < this.lastBombSent + TICK * 5){
            return false
        }
        this.lastBombSent = ELAPSED
        return true
    }

    
    render(){
        if(this.health === 0){
            this.tile.setSrcY(4)
            this.tile.currentFrame = 0
        }

        this.tile.render(this.x, this.y, !this.idle)
    }
}
