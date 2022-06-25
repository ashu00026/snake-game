let snakeArr=[{x: 9,y: 9}];
let food = {x: 4,y: 14};

let inputDir={x: 0, y: 0};
let speed=7;
let score=0;
let lastScreenDisplay=0;
let boardSize=19;


let board=document.querySelector('#board');
let scoreElem=document.querySelector('#score');
let highscoreElem=document.querySelector('#highscore');
const root = document.querySelector(":root");

let foodSound=new Audio("sound/eat.mp3");
let gameOverSound=new Audio("sound/gameover.aac");
let moveSound=new Audio("sound/move.mp3");

function main(gameRefreshtime){
  window.requestAnimationFrame(main);
  // console.log(gameRefreshtime);
  if((gameRefreshtime-lastScreenDisplay)/1000 < 1/speed){ //divide by 1000 as its in milisecond
    return;
  }
  lastScreenDisplay=gameRefreshtime;
  runGame();
}

function isCollide(snakeArr){
  // console.log(snakeArr.length);
  for(var i=1;i<snakeArr.length;i++){
    // console.log(snakeArr[0].x,snakeArr[i].x,snakeArr[0].y,snakeArr[i].y);
    if(snakeArr[0].x===snakeArr[i].x && snakeArr[0].y===snakeArr[i].y){
      // console.log('body');
      return true;
    }
  }
  // console.log(snakeArr[0].x,snakeArr[0].y);
  if(snakeArr[0].x>=boardSize+1 || snakeArr[0].x<=0 || snakeArr[0].y>=boardSize+1 || snakeArr[0].y<=0){
    // console.log('border');
    return true;
  }
}

function runGame(){

  if(isCollide(snakeArr)){
    gameOverSound.play();
    inputDir={x: 0,y: 0};
    alert('Game Over!! '+'Your score : '+score+'\nPress OK to play again...');
    snakeArr=[{x: 9,y: 9}];
    score=0;
    food = {x: 4,y: 14};
    scoreElem.innerHTML="Score : " + score;
  }

  if(snakeArr[0].x==food.x && snakeArr[0].y==food.y){
    foodSound.play();
    score++;
    if(score>highscoreval){
      highscoreval=score;
      localStorage.setItem('highscore',JSON.stringify(highscoreval));
      highscoreElem.innerHTML="High Score : " + highscoreval;
    }
    scoreElem.innerHTML="Score : "+score;
    snakeArr.unshift({x: snakeArr[0].x+inputDir.x,y: snakeArr[0].y+inputDir.y});
    food={x: Math.floor(Math.random() * (boardSize-3))+2,y: Math.floor(Math.random() * (boardSize-3))+2};
  }

  for(var i=snakeArr.length-2;i>=0;i--){
    snakeArr[i+1]={...snakeArr[i]};
  }

  snakeArr[0].x+=inputDir.x;
  snakeArr[0].y+=inputDir.y;

  // display snake
  board.innerHTML="";
  snakeArr.forEach((elem,index)=>{
    snakeElem=document.createElement('div');
    snakeElem.style.gridRowStart=elem.y;
    snakeElem.style.gridColumnStart=elem.x;
    if(index===0){
      snakeElem.classList.add('head');
    }
    else{
      snakeElem.classList.add('snakeBody');
    }
    board.appendChild(snakeElem);
  });

  //display food
  foodElem=document.createElement('div');
  foodElem.style.gridRowStart=food.y;
  foodElem.style.gridColumnStart=food.x;
  foodElem.classList.add('food');
  board.appendChild(foodElem);
}

let highscore=localStorage.getItem('highscore');
if(highscore===null){
  let highscoreval=0;
  localStorage.setItem('highscore',JSON.stringify(highscoreval));
}
else{
  highscoreval=JSON.parse(highscore);
  highscoreElem.innerHTML="High Score : " + highscore;
}

function movement(key){
  inputDir={x: 0,y: 1};
  moveSound.play();
  switch (key) {
      case "ArrowUp":
      // console.log("up");
      inputDir.x=0;
      inputDir.y=-1;
      root.style.setProperty("--pseudo-rotate", 'rotate(180deg)');
      break;

      case "ArrowDown":
      // console.log('down');
      inputDir.x=0;
      inputDir.y=1;
      root.style.setProperty("--pseudo-rotate", 'rotate(0deg)');
      break;

      case "ArrowLeft":
      // console.log('left');
      inputDir.x=-1;
      inputDir.y=0;
      root.style.setProperty("--pseudo-rotate", 'rotate(90deg)');
      break;

      case "ArrowRight":
      // console.log('right');
      inputDir.x=1;
      inputDir.y=0;
      root.style.setProperty("--pseudo-rotate", 'rotate(270deg)');
      break;

      default:
      break;
  }
}

var btns=document.querySelectorAll('.button');
btns.forEach((elem)=>{
  elem.addEventListener('click',(event)=>{
    // console.log(event.target.innerHTML);
    movement("Arrow"+event.target.innerHTML);
  })
});


window.requestAnimationFrame(main);
window.addEventListener('keydown',function(res){
  movement(res.key);
});
