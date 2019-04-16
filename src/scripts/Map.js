class Map{

    constructor(maptype = 0){
        this.maptype = "0"
        this.data = null
        this.tile = null
        this.tileCellSize = CELL_SIZE
    }

    async loadMap(){
        try{
            const map = await fetch("dist/res/maps/" + this.maptype + ".json")
            this.data = await map.json()

            this.tile = new Tile(this.data.tile, this.data.tileRow * this.tileCellSize, this.tileCellSize, 1, this.data.tileRow)
            this.tile.canvas.width = this.data.map[0].length * this.tileCellSize * SCALE
            this.tile.canvas.height = this.data.map.length * this.tileCellSize * SCALE
        }catch(err){
            console.log(err)
        }
        return this
    }

    render(){
        for(let i = 0; i < this.data.map.length; i++){
            for (let j = 0; j < this.data.map[i].length; j++){
                this.tile.currentFrame = this.data.map[i][j]
                this.tile.render(j * CELL_SIZE, i * CELL_SIZE, false)
            }
        }
    }

    isBreakableAt(mx, my){ // stands for matrixX and matrixY
        return CAN_EXPLOSE_TILES.includes(this.data.map[my][mx])
    }

}
