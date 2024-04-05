const CANVAS_HEIGHT = 540;
const CANVAS_WIDTH = 960;

let values = []; // values to be sorted
let column_size;

let cooldown = 5; // frames between sorts
let sorted = false;
let attempts = 0;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
	values = generateRandomArray(96);
	column_size = CANVAS_WIDTH / values.length;

	stroke(255);
	textSize(50);
	fill(255);
}

function draw() {
	background(0);
	if (sorted == false) {
		text(attempts, 10, 40)

		if (frameCount % cooldown == 0) {
			values = bubbleSort(values);
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
	for (let i = 0; i < size; i++) {
		let r = random(1);
		if (r < 0.5) {
			array_.push(i);
		} else {
			array_.unshift(i);
		}
	}
	return array_;
}

