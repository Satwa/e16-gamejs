class Entity {
    constructor(x, y, tile){
        this.x = x
        this.y = y
        this.tile = tile
    }

    render(animated = true){
        this.tile.render(this.x, this.y, animated)
    }
}