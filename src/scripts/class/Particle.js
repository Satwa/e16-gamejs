class Particle extends Entity{
    constructor(matrixX, matrixY) {
        super(matrixX * CELL_SIZE, matrixY * CELL_SIZE, new Tile("tiles/items.png", 256, 128, 2, 4))
        
        this.type = 2
        this.disappearAfter = TICK * 4

        this.tile.setSrcY(1)

        this.readyToDelete = false

        setTimeout(() => {
            this.readyToDelete = true
        }, this.disappearAfter)
    }

    render() {
        if (!this.readyToDelete) {
            super.render()
        }
    }

}