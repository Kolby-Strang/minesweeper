let rows
let columns
let searched
let flagged
let mines
let mineChance = .2
let hasClicked = false


function modifySize(amount, direction){
  if(direction == 'x'){
    rows += amount
    document.getElementById('rows').innerHTML = rows
  }else{
    columns += amount
    document.getElementById('columns').innerHTML = columns
  }
  setGrid()
}

function setGrid(){
  searched = make2DArray(rows, columns)
  populate2DArray(searched, false)
  flagged = make2DArray(rows, columns)
  populate2DArray(flagged, false)
  document.getElementById('gameBody').style.pointerEvents = 'auto'
  document.getElementById('gameStatus').innerHTML = 'Ready To Play!'
  hasClicked = false
  makeMines()
  drawGrid()
}

function cellClicked(row, col){
  if(flagged[row][col])return
  if(!hasClicked){
    let possibleMoves = listPossibleMoves(row, col)
    mines[row][col] = false
    possibleMoves.forEach((move) => {
      mines[move.row][move.col] = false
    })
    hasClicked = true
  }
  if(mines[row][col]){ 
    document.getElementById('gameBody').style.pointerEvents = 'none'
    document.getElementById('gameStatus').innerHTML = 'Game Over'
    document.getElementById('gameBody').classList.add('loseState')
    revealMines()
  }else{
    recursivelyReveal(row, col)
  }
  if(gameIsWon()){
    document.getElementById('gameBody').style.pointerEvents = 'none'
    document.getElementById('gameStatus').innerHTML = 'You Won!!'
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (searched[row][col]) {
          document.getElementById(`${row}-${col}`).style.backgroundColor = 'green'
        }
      }
    }
    document.getElementById('gameBody').classList.add('winState')
  }
}
function cellRightClicked(row, col, event){
  event.preventDefault()
  if(searched[row][col])return
  flagged[row][col] = !flagged[row][col]
  cell = document.getElementById(`${row}-${col}`)
  if(flagged[row][col]){
    cell.style.backgroundImage = "url('images/flag.png')"
  }else{
    cell.style.backgroundImage = ""
  }
}
function makeMines(){
  mines = make2DArray(rows, columns)
  for(let row = 0; row < mines.length; row++){
    for(let col = 0; col < mines[row].length; col++){
      if(Math.random() < mineChance){
        mines[row][col] = true
      }else{
        mines[row][col] = false
      }
    }
  }
}

function revealMines(){
  for(let row = 0; row < mines.length; row++){
    for(let col = 0; col < mines[row].length; col++){
      if(mines[row][col])document.getElementById(`${row}-${col}`).style.backgroundColor = 'red'
    }
  }
}

function recursivelyReveal(row, col){
  if(mines[row][col] || searched[row][col])return
  searched[row][col] = true
  let possibleMoves = listPossibleMoves(row, col)
  document.getElementById(`${row}-${col}`).style.backgroundColor = 'white'
  
  for(let i = 0; i < possibleMoves.length; i++){
    if(mines[possibleMoves[i].row][possibleMoves[i].col]){
      numberSelf(row, col)
      return
    }
  }

  possibleMoves.forEach((move) => {
    recursivelyReveal(move.row, move.col)
  });
}
function numberSelf(row, col){
  let possibleMoves = listPossibleMoves(row, col)
  let mineCount = 0
  possibleMoves.forEach((move) => {
    if(mines[move.row][move.col])mineCount++
  })
  document.getElementById(`${row}-${col}`).innerHTML = `<p>${mineCount}</p>`
}

//#region Utility/Abstraction Functions


function drawGrid(){
  let gameBody = document.getElementById('gameBody')
  gameBody.style.gridTemplateColumns = repeat('auto', columns)
  gameBody.innerHTML = makeDivs()
}
function repeat(phrase, times){
  let result = ''
  for(let i = 0; i < times; i++)result += phrase + ' '
  return result
}
function makeDivs(){
  let result = ''
  for(let row = 0; row < rows; row++){
    for(let col = 0; col < columns; col++){
      result += `<div id="${row}-${col}" oncontextmenu="cellRightClicked(${row}, ${col}, event)" onClick="cellClicked(${row}, ${col})"></div>`
    }
  }
  return result
}
function make2DArray(rowCount, colCount){
  let result = new Array(rowCount)
  for(let row = 0; row < rowCount; row++){
    result[row] = new Array(colCount)
  }
  return result
}
function populate2DArray(arr, value){
  for(let row = 0; row < arr.length; row++){
    for(let col = 0; col < arr[row].length; col++){
      arr[row][col] = value
    }
  }
}
function listPossibleMoves(row, col){
  let result = []
  let totalMoves = [
    {
      row: row + 1,
      col: col
    },
    {
      row: row,
      col: col + 1
    },
    {
      row: row - 1,
      col: col
    },
    {
      row: row,
      col: col - 1
    },
    {
      row: row + 1,
      col: col + 1
    },
    {
      row: row - 1,
      col: col + 1
    },
    {
      row: row - 1,
      col: col - 1
    },
    {
      row: row + 1,
      col: col - 1
    }
  ]
  totalMoves.forEach(move => {
    if(!(move.row<0||move.row>=mines.length||move.col<0||move.col>=mines.length))result.push(move)
  })
  return result
}
function gameIsWon(){
  for(let row = 0; row < rows; row++){
    for(let col = 0; col < columns; col++){
      if(mines[row][col] == searched[row][col])return false
    }
  }
  return true
}


//#endregion


rows = 10
columns = 10
setGrid()