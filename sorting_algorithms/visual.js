const CANVAS_HEIGHT = 540;
const CANVAS_WIDTH = 960;

let values = []; // values to be sorted
let column_size;

let cooldown = 5; // frames between sorts
let sorted = false;
let attempts = 0;

let algorithm;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
	values = generateRandomArray(128);
	column_size = CANVAS_WIDTH / values.length;

	stroke(240);
	textSize(50);
	fill(240);
	
	algorithm = new QuickSort;
}

function draw() {
	background(0);
	if (sorted == false) {
		text(attempts, 10, 40)

		if (frameCount % cooldown == 0) {
			values = algorithm.sort(values);
			attempts++;
		}

		let normalised_values = normalise(values);

		for (let i = 0; i < values.length; i++) {
			rect(i * column_size, CANVAS_HEIGHT, column_size, normalised_values[i] * -1);
		}
	
		if (check() == true) {
			sorted = true;
			noLoop();
		} 

	}

}

// maps array to the canvas dimensions
function normalise(array) {
	let max_ = max(array) + 1;
	let min_ = min(array) - 1;

	let normalised_array = [];

	for (let i = 0; i < array.length; i++) {
		normalised_array[i] = map(array[i], min_, max_, 0, CANVAS_HEIGHT, true);
	}

	return normalised_array;
}

// checks if values[] is sorted, returns true if it is and false if it isn't
function check() { 
	for (let i = 1; i < values.length; i++) {
		if (values[i] < values[i - 1]) {
			return false;
		} 
	}
	return true;
}

function generateRandomArray(size) {
	let array_ = []
	for (let i = 0; i < size; i++) array_[i] = i;

	let temp, current, top = array_.length;
	if(top) {
		while(--top) {
			current = Math.floor(Math.random() * (top + 1));
			temp = array_[current];
			array_[current] = array_[top];
			array_[top] = temp;
		}
	}

	return array_;
}

function updateCursor(x) {
	// should point to the current point being evaluated, might not work currently becuase of for loops
	fill(255, 0, 0);
	rect(x, 0, column_size, CANVAS_HEIGHT)
}
