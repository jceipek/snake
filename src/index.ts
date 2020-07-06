import './main.css';

console.log("Hello World");

const CANVAS: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement;
const CTX = CANVAS.getContext('2d');

const MS_PER_UPDATE = 1000 / 120;

function getMsTs() {
  return (new Date()).valueOf();
}

function update(dtSec: number) {

}

function render(frac: number) {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  CTX.fillStyle = "green";
  CTX.fillRect(Math.sin(getMsTs() / 1000) * 100 + 100, 0, 10, 10);
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

requestAnimationFrame(gameLoop);