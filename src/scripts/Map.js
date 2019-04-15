class Map{

    constructor(maptype = 0, scale = 4, tileCellSize = 16){
        this.maptype = "0"
        this.data = null
        this.tile = null
        this.scale = scale
        this.tileCellSize = tileCellSize
    }

    async loadMap(){
        try{
            const map = await fetch("dist/res/maps/" + this.maptype + ".json")
            this.data = await map.json()

            this.tile = new Tile(this.data.tile, 96, this.tileCellSize, 1, 6, this.scale)
            this.tile.canvas.width = this.data.map.length * this.tileCellSize * this.scale
            this.tile.canvas.height = this.data.map.length * this.tileCellSize * this.scale
        }catch(err){
            console.log(err)
        }
        return this
    }

    render(){
        for(let i = 0; i < this.data.map.length; i++){
            for (let j = 0; j < this.data.map[i].length; j++){
                this.tile.currentFrame = this.data.map[i][j]
                console.log(this.data.map[i][j])
                this.tile.render(j*16, i*16, false)
            }
        }
    }

}