class Game{

    constructor(){
        this.map = new Map()
        this.players = []

        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
    }

    addPlayer(name, sprite){
        this.players.push(new Character(name, sprite, this.map.data.tile))
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.map.render()
        for (let player of this.players) {
            player.render()
        }
    }

}
