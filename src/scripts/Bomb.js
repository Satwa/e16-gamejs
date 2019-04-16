class Bomb {
    constructor(type, x, y/*, catcheable = false*/){
        this.type = type
        // this.catcheable = catcheable // is this an object we can add to stuff or a bomb that's gonna explode?

        this.x = Math.ceil(x / CELL_SIZE) * CELL_SIZE
        this.y = Math.ceil(y / CELL_SIZE) * CELL_SIZE

        this.tile = new Tile("tiles/items.png", 126, 64, 1, 2)

        this.readyToDelete = false

        this.explodeAfter = TICK * 10


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