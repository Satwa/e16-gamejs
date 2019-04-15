class Map {

    constructor(width, height){
        this.width   = width
        this.height  = height
        this.maptype = "0"
        this.maptile = null
    }

    async loadMap(){
        const map = await fetch("dist/res/maps/" + this.maptype + ".json")
        this.maptile = JSON.parse(map)

        return this
    }

    render(){
        
    }

}