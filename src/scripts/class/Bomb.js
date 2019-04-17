class Bomb extends Entity{
    constructor(type, x, y){
        super(Math.ceil(x / CELL_SIZE) * CELL_SIZE, Math.ceil(y / CELL_SIZE) * CELL_SIZE, new Tile("tiles/items.png", 256, 128, 2, 4))
        this.type = type
        this.explodeAfter = TICK * 20


        this.readyToDelete = false

        setTimeout(() => {
            this.readyToDelete = true
        }, this.explodeAfter)
    }

    render(){
        if(!this.readyToDelete){
            this.tile.currentFrame = this.type
            super.render(false)
        }
    }
    
}