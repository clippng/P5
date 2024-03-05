/** 
 * Simple js implementation of Conway's game of life using the 
 * p5 library. Initial state can be a set number of cells in the 
 * center or fully randomised across the whole grid based on a 
 * density value. Next step would be to add multiple states and
 * more complex rule sets.
 */


const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const BACKGROUND_COLOUR = 0;

let generations_per_second = 10;
let grid;
let cell_size = 4;
let columns, rows;

let generation = 0;

let paused = false;

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
	frameRate(60); // struggles to go any higher than 20
  	columns = width / cell_size;
	rows = height / cell_size;
  	grid = initialiseGrid(columns, rows);
	randomiseStartingCells(16);
	//fullyRandomiseStartingCells();
}

function draw() {
	if (paused == false) {
		background(BACKGROUND_COLOUR);
	

		drawGrid();
		if (frameCount % (60 / generations_per_second) == 0) {
			nextGeneration();
		}

		stroke(255);
		fill(255);
		text("Generation: " + paused, 10, 10);
		text("fps: " + round(frameRate()), 10, 20)		
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
			if (grid[i][j] === 1) {
				let g = map(i, 0, columns, 0, 255);
				let b = map(j, 0, rows, 0, 255);
				fill(0, g, b);
				let x = i * cell_size;
				let y = j * cell_size;
				square(x, y, cell_size);
			} 
		}
	}
}

function clearGrid() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
		  	grid[i][j] = 0;
		}
	}
}

function nextGeneration() {
	let next_generation = initialiseGrid(columns, rows);

	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			if (checkBorder(i, j) === false) { // stops errors from checking outside the grid
				let neighbors = getLiveNeighbors(i, j);	
				if (grid[i][j] == 1) {
					if (neighbors < 2) {
						next_generation[i][j] = 0;
					} else if (neighbors === 2 || neighbors === 3) {
						next_generation[i][j] = 1;
					} else if (neighbors > 3) {
						next_generation[i][j] = 0;
					}
				} else if (grid[i][j] == 0) {
					if (neighbors === 3) {
						next_generation[i][j] = 1;
					}
				}
			} else {
				next_generation[i][j] = 0;
			}
		}
	}
	generation++
	grid = next_generation;
}

function checkBorder(column, row) {
	if (column + 1 >= columns || column - 1 <= 0 || row + 1 >= rows || row - 1 <= 0) {
		return true;
	} else {
		return false;
	}
}

function getLiveNeighbors(column, row) {
	let live_neighbors = 0;
	if (grid[column + 1][row + 1] === 1) {
		live_neighbors++;
	} if (grid[column + 1][row - 1] === 1) {
		live_neighbors++;
	} if (grid[column + 1][row] === 1) {
		live_neighbors++;
	} if (grid[column][row + 1] === 1) {
		live_neighbors++;
	} if (grid[column][row - 1] === 1) {
		live_neighbors++;
	} if (grid[column - 1][row + 1] === 1) {
		live_neighbors++;
	} if (grid[column - 1][row - 1] === 1) {
		live_neighbors++;
	} if (grid[column - 1][row] === 1) {
		live_neighbors++;
	}
	return live_neighbors;
}

function randomiseStartingCells(number_of_cells) {
	let created_cells = 0;
	while (created_cells < number_of_cells) {
		let offset_x = (floor(random() * 6)) - 3;
		let offset_y = (floor(random() * 6)) - 3;

		if (grid[CANVAS_HEIGHT / cell_size / 2 + offset_y][CANVAS_WIDTH / cell_size / 2 + offset_x] === 1) {
			continue;
		} else {
			grid[CANVAS_HEIGHT / cell_size / 2 + offset_y][CANVAS_WIDTH / cell_size / 2 + offset_x] = 1;
			created_cells++;
		}
	}
}

function fullyRandomiseStartingCells() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = round(random(0.55));
		}
	}
}

// simulates the randomised cells to ensure they dont jsut all die instantly
// doesnt work currently
function checkStartingCells() {
loop1:
	for (let i = 0; i < 20; i++) {
loop2:
		for (let i = 0; i < columns; i++) {
loop3:
			for (let j = 0; j < rows; j++) {
				if (grid[i][j] === 1) {
					continue loop1;
				} else {
					return false;
				}
			}
		}
	}
	return true;
}

function reset() {
	clearGrid();
	fullyRandomiseStartingCells();
}

function keyPressed() {
	if (keyCode == 32) {
		if (paused == false) {
			paused = true;
		} else {
			paused = false;
		}
	} 
	if (keyCode == 114) {
		reset();
	}
}