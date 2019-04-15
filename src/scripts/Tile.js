class Tile {
    
    constructor(image, width, height, row, col){
        //this.image = 
        this.width = width
        this.height = height

        this.row = row
        this.col = col

        this.totalCell = row * col

        this.caseHeight = parseInt(width / col)
        this.caseWidth  = parseInt(height / row)
    }

    render(){
        
    }

}