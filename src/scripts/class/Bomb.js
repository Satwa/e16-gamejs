class Bomb {
    constructor(type, x, y/*, catcheable = false*/){
        this.type = type
        this.explodeAfter = TICK * 20
        // this.catcheable = catcheable // is this an object we can add to stuff or a bomb that's gonna explode?

        this.x = Math.ceil(x / CELL_SIZE) * CELL_SIZE
        this.y = Math.ceil(y / CELL_SIZE) * CELL_SIZE

        this.tile = new Tile("tiles/items.png", 256, 128, 2, 4)

        this.readyToDelete = false

        setTimeout(() => {
            this.readyToDelete = true
        }, this.explodeAfter)
    }

    render(){
        if(!this.readyToDelete){
            this.tile.currentFrame = this.type
            this.tile.render(this.x, this.y, false)
        }
    }
    
}