import './main.css';

console.log("Hello World");

const CANVAS: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement;
const CTX = CANVAS.getContext('2d');

const MS_PER_UPDATE = 1000 / 120;



type World = Uint8Array;

type V2D = [number, number];

interface GameState {
  world: World
  snakeHead: V2D,
  snakeTail: V2D
}

const WIDTH = 100;
const HEIGHT = 100;
const PIXEL_DIM = 10;

const STATE: GameState = {
  world: new Uint8Array(WIDTH * HEIGHT),
  snakeHead: [50, 50],
  snakeTail: [51, 50]
}

const COLORS = {
  food: "green",
  snake: "white",
}

enum GroundType {
  Empty = 0,
  // Forced to be in this order
  Up = 1,
  Right = 2,
  Down = 3,
  Left = 4,
  //
  Food = 5
}

function getMsTs() {
  return (new Date()).valueOf();
}

function adjustPosFromDir(oldPos: V2D, dir: ) : V2D {
  
}

function update(dtSec: number) {


  // Move
  {
    let snakeDir = getGroundType(STATE.world, STATE.snakeHead);
    console.assert(snakeDir >= GroundType.Up && snakeDir <= GroundType.Left);
    let newSnakeHead: V2D = [STATE.snakeHead[0], STATE.snakeHead[1]];
    switch (snakeDir) {
      case GroundType.Up:
        newSnakeHead[1]--;
        break;
      case GroundType.Down:
        newSnakeHead[1]++;
        break;
      case GroundType.Right:
        newSnakeHead[0]++;
        break;
      case GroundType.Left:
        newSnakeHead[0]--;
        break;
    }
    if (newSnakeHead[1] >= 0 && newSnakeHead[1] <= HEIGHT &&
      newSnakeHead[0] >= 0 && newSnakeHead[0] <= WIDTH) {
      setGroundType(STATE.world, newSnakeHead, snakeDir);
      STATE.snakeHead = newSnakeHead;
    } else {
      // TODO: Game over
    }
  }
  {
    let snakeDir = getGroundType(STATE.world, STATE.snakeTail);
    console.assert(snakeDir >= GroundType.Up && snakeDir <= GroundType.Left);
    let newSnakeTail: V2D = [STATE.snakeTail[0], STATE.snakeTail[1]];
    switch (snakeDir) {
      case GroundType.Up:
        newSnakeTail[1]--;
        break;
      case GroundType.Down:
        newSnakeTail[1]++;
        break;
      case GroundType.Right:
        newSnakeTail[0]++;
        break;
      case GroundType.Left:
        newSnakeTail[0]--;
        break;
    }
    if (newSnakeTail[1] >= 0 && newSnakeTail[1] <= HEIGHT &&
      newSnakeTail[0] >= 0 && newSnakeTail[0] <= WIDTH) {
      setGroundType(STATE.world, STATE.snakeTail, GroundType.Empty);
      STATE.snakeTail = newSnakeTail;
    } else {
      // TODO: Game over
    }
  }

}

function render(frac: number) {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  let world = STATE.world;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      switch (world[y * WIDTH + x] as GroundType) {
        case GroundType.Food:
          {
            CTX.fillStyle = COLORS.food;
            CTX.fillRect(x * PIXEL_DIM, y * PIXEL_DIM, PIXEL_DIM, PIXEL_DIM);
            break;
          }
        case GroundType.Up:
        case GroundType.Right:
        case GroundType.Down:
        case GroundType.Left:
          {
            CTX.fillStyle = COLORS.snake;
            CTX.fillRect(x * PIXEL_DIM, y * PIXEL_DIM, PIXEL_DIM, PIXEL_DIM);
            break;
          }
      }
    }
  }
}

let previousMsTs = getMsTs();
let lagMs = 0.0;
function gameLoop() {
  let currMsTs = getMsTs();
  let elapsedMS = currMsTs - previousMsTs;
  previousMsTs = currMsTs;
  lagMs += elapsedMS;

  while (lagMs >= MS_PER_UPDATE) {
    update(elapsedMS / 1000);
    lagMs -= MS_PER_UPDATE;
  }

  render(lagMs / MS_PER_UPDATE);
  requestAnimationFrame(gameLoop);
}


function setGroundTypeExplicit(world: World, x: number, y: number, type: GroundType) {
  world[y * WIDTH + x] = type;
}

function setGroundType(world: World, pos: V2D, type: GroundType) {
  world[pos[1] * WIDTH + pos[0]] = type;
}

function getGroundType(world: World, pos: V2D): GroundType {
  return world[pos[1] * WIDTH + pos[0]];
}

// Canvas Setup
CANVAS.width = WIDTH * PIXEL_DIM;
CANVAS.height = HEIGHT * PIXEL_DIM;

// Initialize World
setGroundTypeExplicit(STATE.world, 50, 50, GroundType.Up);
setGroundTypeExplicit(STATE.world, 51, 50, GroundType.Left);
setGroundTypeExplicit(STATE.world, 30, 30, GroundType.Food);

requestAnimationFrame(gameLoop);