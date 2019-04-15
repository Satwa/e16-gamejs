class Character { // recup la map avec les pos pour éviter que le personnage dépasse les bords de la map !

    constructor(name, sprite, scale, map){
      this.tileCellSize = 16

      this.name = name
      this.scale = scale
      this.sprite = sprite

      this.map = map

      this.x = 16
      this.y = 16

      this.tile = new Tile("players/" + this.sprite + ".png", this.tileCellSize, 4, 6, this.scale)
    }
    moveX(factor = 1) {
      this.tile.render(this.x, this.y)
      x += 16 * factor
      if (factor == -1) {
        this.tile.srcY = 2 // en fonction des sprites
      }
      else {
        this.tile.srcY = 0 // en fonction des sprites
      }
      if (this.tile.srcX < 0 || this.tile.srcX > this.tile.height) {

      }
    }
    moveY(factor = 1) {
      this.tile.render(this.x, this.y)
      y += 16 * factor
      if (factor == -1) {
        this.tile.srcY = 3 // en fonction des sprites
      }
      else {
        this.tile.srcY = 1 // en fonction des sprites
      }
      if (this.tile.srcY < 0 || this.tile.srcY > this.tile.height) {

      }
      // est-ce que la case suivante est libre ?
    }


}

/*
moveX()
moveY()
useStuff()
hasStuff()
render()

- health : 3
    - red bomb = -1
    - black bomb = -3
- stuff
    - bombs
    - bonus
    - malus
*/
