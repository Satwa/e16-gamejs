class Game{

    constructor(){
        this.scale = 4
        this.map = new Map()
    }

    addPlayer(){

    }

    update() {
        this.map.loadMap().then(() => {
            this.map.render()
        })
    }

}