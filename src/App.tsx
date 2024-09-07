import { useEffect, useState } from "react"
import gridCell from "./util"


function App() {

  return (

    <>
      <Board/>
    </>

  )
}


const Board = ()=>{
  const [grid, setgrid] = useState(gridCell(12))  
  const [frame, setframe] = useState<Boolean>(false)
  const [fireOnce, setFireOnce] = useState<Boolean>(true)
  const [show, setShow] = useState<Boolean>(false)
  const [total_cells, setTotalCells] = useState<number>(0)

  const _CellGrid = [...grid]
  let current_cell = _CellGrid[0][0]
  let neighbour_cells: any[] =  [_CellGrid[0][1], _CellGrid[1][0] ]
  let visited_stack:any[][] = []


  const recursiveBacktracker=(curr_cell:any, neighbour:any)=>{

    // remove the right and left border of the start and end cell
    _CellGrid[11][11].rightBorder = false
    _CellGrid[0][0].leftBorder = false

    // if the are no neighbour cells than backtrack
    if(neighbour.length == 0){
      curr_cell.current = false
      curr_cell.visited = true
      Backtrack()
      return
    }

    curr_cell.current = true
    
    //get the cordinate of the current cell
    let _x: number = 0
    let _y: number = 0
    
    for(let x = 0; x < _CellGrid.length; x++){
      
      for(let y = 0; y < _CellGrid.length; y++){
        if(_CellGrid[x][y].current === true){
          _x = x
          _y = y
        }
      }
      
    }
    
    // select a random neighbour cell
    // and make it the new current cell
    let selected_neighbour: number = Math.floor(Math.random() * neighbour.length)
    neighbour[selected_neighbour].current = true
    curr_cell.current = false
    curr_cell.visited = true
    setTotalCells((prev:number) => prev + 1 ) 


    // get the cordinate of the new current cell
    let x_cordinate:number = 0
    let y_cordinate:number = 0 

    for(let x = 0; x < _CellGrid.length; x++){

      for(let y = 0; y < _CellGrid.length; y++){
         if(_CellGrid[x][y].current === true){
            x_cordinate = x
            y_cordinate = y

            visited_stack.unshift([ x_cordinate, y_cordinate ])
         }
      }

    }

    // remove the borders of the current cell and the new current cell
    if(_y < y_cordinate){
      _CellGrid[_x][_y].rightBorder = false
      _CellGrid[x_cordinate][y_cordinate].leftBorder = false

    }else if(_y > y_cordinate){

      _CellGrid[_x][_y].leftBorder = false
      _CellGrid[x_cordinate][y_cordinate].rightBorder = false
      
    }

    if(_x < x_cordinate){
      _CellGrid[_x][_y].bottomBorder = false
      _CellGrid[x_cordinate][y_cordinate].topBorder = false

    }else if(_x > x_cordinate){
      _CellGrid[_x][_y].topBorder = false
      _CellGrid[x_cordinate][y_cordinate].bottomBorder = false

    }


    // get all available neighbour cells
    // if a neighbour cell is invalid it will be stored as undefined
    let available_cells = [

      _CellGrid?.[x_cordinate]?.[y_cordinate + 1],  
      _CellGrid?.[x_cordinate]?.[y_cordinate - 1],  
      _CellGrid?.[x_cordinate + 1  ]?.[y_cordinate],  
      _CellGrid?.[x_cordinate - 1 ]?.[y_cordinate],  
    
    ]

    // remove all undefined neighbour cells
    available_cells = available_cells.filter((item)=>
      item != undefined
    )

    // get all unvisited neighbour cells
    neighbour_cells = available_cells.filter((item)=> !item?.visited )
    
    setgrid(_CellGrid)

    current_cell = _CellGrid[x_cordinate][y_cordinate]



    setTimeout(()=>{
      recursiveBacktracker(current_cell,neighbour_cells)
      setframe((prev:Boolean)=> !prev)
    },200)

  }


  const Backtrack = ()=>{
    
    
    let last_cell = visited_stack[0]
    let x_cordinate = last_cell[0]
    let y_cordinate = last_cell[1]

    let is_Maze_done = _CellGrid.every((row)=> row.every((cell) => cell.visited))

    if(is_Maze_done){
      _CellGrid[x_cordinate][y_cordinate].current = false
      return
    }
    
    _CellGrid[x_cordinate][y_cordinate].current = true


    let available_cells = [
      _CellGrid?.[x_cordinate]?.[y_cordinate + 1],  
      _CellGrid?.[x_cordinate]?.[y_cordinate - 1],  
      _CellGrid?.[x_cordinate + 1  ]?.[y_cordinate],  
      _CellGrid?.[x_cordinate - 1 ]?.[y_cordinate],  
    ]

    let _neighbour_cells :any[]= []
    if(!available_cells.every((cell)=> cell == undefined)){
      _neighbour_cells = available_cells.filter((cell)=> cell != undefined) 

    }

    if(_neighbour_cells.every((cell) => cell.visited)){
      
      setTimeout(()=>{
        visited_stack = visited_stack.slice(1)
        _CellGrid[x_cordinate][y_cordinate].current = false
        Backtrack()
        setframe((prev:Boolean)=> !prev)

      },300)


    }else{
      _neighbour_cells = _neighbour_cells.filter((cell)=> !cell.visited)
      recursiveBacktracker(_CellGrid[x_cordinate][y_cordinate],_neighbour_cells)

    }
  } 


  useEffect(()=>{
  }, [frame])
  
  
  
  const HandleClick =()=>{
    if(fireOnce){
      setgrid(gridCell(12))
      recursiveBacktracker(current_cell,neighbour_cells)
      setFireOnce(false)
    }
  }


  const Reset = ()=>{
    if(total_cells > 142){
      setgrid(gridCell(12))
      setframe((prev:Boolean)=> !prev)
      setFireOnce(true)
      setTotalCells(0)
      
    }else{
      setShow(true)
      setTimeout(()=>{
        setShow(false)
      },4000)
    }
  }



  return(
    <div className=" w-[20rem] aspect-square rounded-xl grid grid-cols-12 grid-rows-12 p-1 relative" >
      <Wait show={show} />
      {

        grid.map((item)=>

          item.map((cell, index)=>
              <Cell key={index} square={cell} />
          )
        
        )

        
      }

      <Buttons HandleClick={HandleClick} Reset={Reset} />


    </div>
  )
}


const Wait = ({ show }: any)=>{
  return(
    <p className={`absolute ${ show ? 'flex': 'hidden'} uppercase top-[-3rem] right-[-3rem] text-nowrap text-slate-300 text-2xl`} >
      Please Wait for the maze to finish
    </p>
  )
}

const Buttons = ({ HandleClick, Reset }: { HandleClick: ()=> void, Reset:()=> void })=>{

  return(
  <div className=" flex flex-col  absolute bottom-[-6rem] gap-2  left-0 right-0 ml-auto mr-auto  " >
        <button className="font-semibold py-2 rounded-lg bg-slate-300 " 
        onClick={()=>HandleClick()}>

        Start Generation

        </button>

        <button className="font-semibold py-2 rounded-lg bg-slate-300  " 
        onClick={()=>Reset()}>

         Reset

        </button>
  </div>

  )
}


const Cell = ({ square }: any)=>{

  return(

    <div className={`bg-white ${square.current} `} style={{
      backgroundColor: square.current ? 'purple' : square.visited ? "black" : "gray",
      borderBottom: square.bottomBorder ? '2px solid RGB(215 217 219)' : '',
      borderTop: square.topBorder ?'2px solid RGB(215 217 219)': '',
      borderLeft: square.leftBorder ? '2px solid RGB(215 217 219)': '',
      borderRight: square.rightBorder ? '2px solid RGB(215 217 219)': ''
    }}  >

    <h1>{ square.current }</h1>

  </div>
  )
}



export default App
