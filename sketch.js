let canvasSize = 500;
let canvas;
let boardSize = 4;
let tileSpeed = 20;
let value1 = 2;
let value2 = 4;
let valRatio = .9;
let game;
let update = true;
let newTiles = [];

function setup() {
  resetGame();

  let resetButton = createButton("RESET");
  resetButton.mousePressed(resetGame);
}

function setCanvasSize() {
  let sizes = [660, 500, 750, 1050, 1400, 1350, 1350, 1650, 500];
  let values = ["3", "4", "5", "6", "7", "8", "9", "10"];
  let index = values.indexOf(boardSize.toString());
  if (index < 0) index = 8;
  canvasSize = sizes[index];
}

function resetGame() {
  boardSize = select("#board-size").value();
  value1 = parseInt(select("#value-1").value());
  value2 = parseInt(select("#value-2").value());

  setCanvasSize();

  let zoom = 500 / canvasSize * 100;
  tileSpeed = 4000 / zoom;

  canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("sketch-holder");
  canvas.style("zoom", zoom + "%");

  noStroke();

  game = new Game(canvasSize, boardSize, value1, value2, valRatio);
  game.start();

  update = true;
}

function keyPressed() {
  if (update) return;

  let moveMade = false;

  switch (keyCode) {
    case UP_ARROW: moveMade = game.moveVertical(true); break;
    case RIGHT_ARROW: moveMade = game.moveHorizontal(false); break;
    case DOWN_ARROW: moveMade = game.moveVertical(false); break;
    case LEFT_ARROW: moveMade = game.moveHorizontal(true); break;
    default: return;
  }
  update = moveMade;
}

function updateBoard() {
  textAlign(CENTER, CENTER);
  let offset = game.tileSize / 2;
  newTiles = [];

  fill(153);
  game.positions.forEach(p => {
    rect(p.x - offset, p.y - offset, game.tileSize, game.tileSize);
  });

  update = false;

  game.tiles.forEach(t => {
    fill(t.color());
    rect(t.x - offset, t.y - offset, t.width, t.height);

    fill(76);
    textStyle(t.isNew ? BOLD : NORMAL);
    textSize(t.textSize());
    text(t.value, t.x, t.y);

    if (t.isNew) newTiles.push(t);

    if (t.setNewPosition(tileSpeed)) update = true;
  });

  select("#score").html(game.score);
}

function draw() {
  if (!update) return;

  background(76);
  updateBoard();

  if (update) return;

  newTiles.forEach(t => t.isNew = false);
  game.addTile();
  updateBoard();

  if (!game.hasValidMove()) canvas.style("border", "20px solid #ff0000");
  else if (game.highestValue >= 2048) canvas.style("border", "20px solid #008f7a");
}