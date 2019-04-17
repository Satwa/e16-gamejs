class Particle {
    constructor(matrixX, matrixY) {
        this.type = 2
        this.disappearAfter = TICK * 4

        this.x = matrixX * CELL_SIZE
        this.y = matrixY * CELL_SIZE

        this.tile = new Tile("tiles/items.png", 256, 128, 2, 4)
        this.tile.setSrcY(1)

        this.readyToDelete = false

        setTimeout(() => {
            this.readyToDelete = true
        }, this.disappearAfter)
    }

    render() {
        if (!this.readyToDelete) {
            this.tile.render(this.x, this.y)
        }
    }

}