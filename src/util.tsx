
export class Cell{
    visited: Boolean
    current: Boolean
    topBorder:Boolean = true
    bottomBorder:Boolean = true
    leftBorder:Boolean = true
    rightBorder:Boolean = true

    constructor(visited:Boolean, current:Boolean){
        this.visited = visited
        this.current = current
    }
}

function gridCell(row_col_number:number){

    let placeholder: Cell[] = []
    let grid: Cell[][]  = []

    for(let x = 0; x < row_col_number; x++){

        for(let y = 0; y < row_col_number; y++ ){

            placeholder.push(new Cell(false, false))
        }

        grid.push(placeholder)
        placeholder = []

    }

    return grid
}

export default gridCell
