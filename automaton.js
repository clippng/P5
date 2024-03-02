const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const BACKGROUND_COLOUR = 100;

let grid;
let cell_size = 5;
let columns, rows;

class Cell {
	state = 0;
	x;
	y;
	constructor(column, row) {
		this.x = column * cell_size;
		this.y = row * cell_size;
	}
}

function setup() {
  	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  	columns = width / cell_size;
	rows = height / cell_size;
  	grid = initialiseGrid(columns, rows);

	grid[CANVAS_HEIGHT / cell_size / 2][CANVAS_WIDTH / cell_size /2] = 1;
	grid[CANVAS_HEIGHT / cell_size /2][CANVAS_WIDTH / cell_size /2 - 1] = 1;
	grid[CANVAS_HEIGHT / cell_size /2 - 1][CANVAS_WIDTH / cell_size /2 - 1] = 1;
	grid[CANVAS_HEIGHT / cell_size /2 + 1][CANVAS_WIDTH / cell_size /2 - 1] = 1;
}

function draw() {
  	background(BACKGROUND_COLOUR);
  
  	drawGrid();
  
	if (frameCount % 20 == 0) {
		nextGeneration();
	}
}

function initialiseGrid(cols, rows) {
	let array = new Array(cols);

	for (let i = 0; i < array.length; i++) {
	  	array[i] = new Array(rows);
		for (let j = 0; j < array[i].length; j++) {
			array[i][j] = 0;
		}
	}
	return array;
}

function drawGrid() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
		  	noStroke();
			fill(grid[i][j] * 255);
			let x = i * cell_size;
			let y = j * cell_size;
			square(x, y, cell_size);
		}
	}
}

function nextGeneration() {
let next_generation = grid;

	for (let i = 1; i < columns -1; i++) {
		for (let j = 1; j < rows -1; j++) {

			// 0 = dead 1 = alive
			let state = next_generation[i][j];
			let neighbors = getLiveNeighbors(i, j);

			if (state === 1) {
				if (neighbors < 2) {
					next_generation[i][j] = 0;
				} else if (neighbors === 2 || neighbors === 3) {
					next_generation[i][j] = 1;
				} else if (neighbors > 3) {
					next_generation[i][j] = 0;
				}
			} else if (state === 0) {
				if (neighbors === 3) {
					next_generation[i][j] = 1;
				}
			}
		}
	}
	grid = next_generation;
}

function getLiveNeighbors(column, row) {
	let live_neighbors = 0;
	if (grid[column + 1][row + 1] === 1) {
		live_neighbors++;
	} else if (grid[column + 1][row - 1] === 1) {
		live_neighbors++;
	} else if (grid[column + 1][row ] === 1) {
		live_neighbors++;
	} else if (grid[column][row + 1] === 1) {
		live_neighbors++;
	} else if (grid[column][row - 1] === 1) {
		live_neighbors++;
	} else if (grid[column - 1][row + 1] === 1) {
		live_neighbors++;
	} else if (grid[column - 1][row - 1] === 1) {
		live_neighbors++;
	} else if (grid[column - 1][row] === 1) {
		live_neighbors++;
	}
	return live_neighbors;
}