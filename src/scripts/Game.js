class Game{

    constructor(){
        this.scale = 4
        this.map = new Map()
        this.players = []
    }

    addPlayer(name, sprite){
      this.players.push(new Character(name, sprite, this.scale, this.map.data.tile))
    }

    update() {
        this.map.loadMap().then(() => {
            this.map.render()
        })
    }

}
