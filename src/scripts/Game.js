class Game{

    constructor(){
        this.map = new Map()
        this.players = []
    }

    addPlayer(name, sprite){
        this.players.push(new Character(name, sprite, SCALE, this.map.data.tile))
    }

    update() {
        this.map.loadMap().then(() => {
            this.map.render()
            for(let player of this.players){
                player.moveX()
                // player.render()
            }
        })
    }

}
