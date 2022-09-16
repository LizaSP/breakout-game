const board = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
let startPosition = [235, 10]
let currentPosition = startPosition
let startBallPosition = [275, 32]
let currentBallPosition = startBallPosition
let scores = 0
const blockWidth = 100
const blockHeight = 20
const boardwidth = 560
const boardHeight = 300
const ballSize = 20
let timerId

let xDirection = 2
let yDirection = 2

// add a start button
const startBtn = document.querySelector('.start-button')
startBtn.innerHTML = 'New Game'
startBtnPosition()

function startBtnPosition(){
  startBtn.style.bottom = `17vh`
  startBtn.style.left = `44vw`
}

function playGame() {
  // create block
  class Block{
    constructor(xAxis, yAxis){
      this.bottomLeft = [xAxis, yAxis]
      this.bottomRight = [xAxis + blockWidth, yAxis]
      this.topLeft = [xAxis, yAxis + blockHeight]
      this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
  }

  // all the blocks, coordinates
  const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),

  ]

  // draw the block
  function createBlocks(){
    for (let i = 0; i < blocks.length; i++){
      const block = document.createElement('div')
      block.classList.add('block')
      block.style.bottom = `${blocks[i].bottomLeft[1]}px`
      block.style.left = `${blocks[i].bottomLeft[0]}px`
      board.appendChild(block)
    }
  }
  createBlocks()

  // add user
  const user = document.createElement('div')
  user.classList.add('user')
  positionUser()
  board.appendChild(user)

  function positionUser(){
    user.style.bottom = `${currentPosition[1]}px`
    user.style.left = `${currentPosition[0]}px`
  }

  function moveUser(e){
    switch(e.key){
      case 'ArrowLeft': 
        if (currentPosition[0] > 5){
          currentPosition[0] -= 10
          positionUser()
        }
        break;
        case 'ArrowRight': 
          if (currentPosition[0] < boardwidth - blockWidth - 10){
            currentPosition[0] += 10
            positionUser()
          }
          break
    }
  }

  document.addEventListener('keydown', moveUser)

  // add ball
  const ball = document.createElement('div')
  ball.classList.add('ball')
  ballPosition()
  board.appendChild(ball)

  function ballPosition(){
    ball.style.bottom = `${currentBallPosition[1]}px`
    ball.style.left = `${currentBallPosition[0]}px`
  }

  //move ball
  function moveBall(){
    currentBallPosition[0] += xDirection
    currentBallPosition[1] += yDirection
    ballPosition()
    checkForCollision()
  }

  timerId = setInterval(moveBall, 20)

  function checkForCollision(){

    //check for win
    if (blocks.length === 0){
      clearInterval(timerId)
      scoreDisplay.innerHTML = `You won! Your score: ${scores}`
      document.removeEventListener('keydown', moveUser)
      ball.remove()
      user.remove()
    }

    // check block collitions
    for (let i = 0; i < blocks.length; i++){
      if (
        (currentBallPosition[0] > blocks[i].bottomLeft[0] &&
        currentBallPosition[0] < blocks[i].bottomRight[0]) &&
        (currentBallPosition[1] + ballSize > blocks[i].bottomLeft[1] &&
          currentBallPosition[1] < blocks[i].topLeft[1])
      ) {
        const allBlocks = Array.from(document.querySelectorAll('.block'))
        // allBlocks[i].classList.remove('block')
        allBlocks[i].remove()
        blocks.splice(i, 1)
        changeDirection()
        scores++
        scoreDisplay.innerHTML = scores
      }
    }
    // wall collisions
    if (
      currentBallPosition[0] >= boardwidth - ballSize || 
      currentBallPosition[1] >= boardHeight - ballSize ||
      currentBallPosition[0] <= 0 
      ) {
      changeDirection()
    }
    //check for gameover
    if (currentBallPosition[1] <= 0){
      clearInterval(timerId)
      scoreDisplay.innerHTML = 'You lost!'
      document.removeEventListener('keydown', moveUser)
      ball.remove()
      user.remove()
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks.forEach(block => block.remove())
      
    }
      
    // user collisions 
    if (
      (currentBallPosition[0] > currentPosition[0] &&
      currentBallPosition[0] < currentPosition[0] + blockWidth) &&
      (currentBallPosition[1] > currentPosition[1] &&
        currentBallPosition[1] < currentPosition[1] + blockHeight)
    ){
      changeDirection()
    }
  }

  function changeDirection(){
    if (xDirection === 2 && yDirection === 2){
      yDirection = -2
      return
    }  
    if (xDirection === 2 && yDirection === -2){
      xDirection = -2
      return
    }  
    if (xDirection === -2 && yDirection === -2){
      yDirection = 2
      return
    }
    if (xDirection === -2 && yDirection === 2){
      xDirection = 2
      return
    }
  }
}

startBtn.addEventListener('click', () => {
  startPosition = [235, 10]
  startBallPosition = [275, 32]
  currentBallPosition = startBallPosition
  currentPosition = startPosition
  scores = 0
  xDirection = 2
  yDirection = 2
  scoreDisplay.innerHTML = 'New Game'
  playGame()
})
