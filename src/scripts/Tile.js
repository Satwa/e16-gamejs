class Tile {

    constructor(image, width, height, row, col){
        this.image = new Image()
        this.image.src = "dist/res/" + image
        this.width = width
        this.height = height

        this.row = row
        this.col = col

        this.srcX = 0
        this.srcY = 0

        this.totalCell = row * col

        this.cellHeight = parseInt(width / col)
        this.cellWidth  = parseInt(height / row)

        this.currentFrame = 0
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
    }

    // getCells() {
      // let cells = new Array()
      // for (let i = 0; i < this.row; i++) {
      //   for (let j = 0; j < this.row; j++) {
      //
      //   }
      // }
    // }

    updateFrame(animated){
        if(animated)
            this.currentFrame = this.currentFrame++ % this.row
        this.srcX = this.currentFrame * this.cellWidth
    }

    render(x, y, animated = true){
        this.updateFrame(animated)

        this.context.drawImage(this.image, this.srcX, this.srcY, this.cellWidth, this.cellHeight, x * SCALE, y * SCALE, this.cellWidth * SCALE, this.cellHeight * SCALE)
    }

}
