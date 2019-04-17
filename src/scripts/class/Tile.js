class Tile {

    constructor(image, width, height, row, col, scale = SCALE){
        this.scale = scale

        this.image = new Image()
        this.image.src = "dist/res/" + image
        this.width = width
        this.height = height

        this.row = row
        this.col = col

        this.srcX = 0
        this.srcY = 0

        this.totalCell = row * col

        this.cellHeight = height / row
        this.cellWidth  = width / col

        this.currentFrame = 0
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
    }

    setSrcY(rowNumber){
        this.srcY = rowNumber * this.cellHeight
    }

    updateFrame(animated){
        if(animated)
            this.currentFrame = ++this.currentFrame % this.col
        this.srcX = this.currentFrame * this.cellWidth
    }

    render(x, y, animated = true){
        this.updateFrame(animated)

        this.context.drawImage(this.image, this.srcX, this.srcY, this.cellWidth, this.cellHeight, x * this.scale, y * this.scale, this.cellWidth * this.scale, this.cellHeight * this.scale)
    }

}
