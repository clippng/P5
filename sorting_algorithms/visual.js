/**
 * Contains the main p5.js functions and is responsible 
 * for drawing the current state of the data to the canvas
 */

const CANVAS_HEIGHT = 540;
const CANVAS_WIDTH = 960;

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
	
		if (checkSorted(values) == true) {
			sorted = true;
			noLoop();
		} 

	}

}

