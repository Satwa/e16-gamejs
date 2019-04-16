class Game{

    constructor(){
        this.map = new Map()
        this.players = []
        this.items = []

        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
    }

    addPlayer(name, sprite){
        this.players.push(new Character(name, sprite, this.map.data.map))
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.map.render()
        for(let [index, item] of this.items.entries()){
            item.render()
            if(item.readyToDelete){
                this.items.splice(index, 1)
                // delete item
            }
        }

        for (let player of this.players) {
            player.render()
        }
    }

}
