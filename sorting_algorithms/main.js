/**
 * Contains the main p5.js functions and is responsible 
 * for drawing the current state of the data to the canvas
 */

const CANVAS_HEIGHT = 540;
const CANVAS_WIDTH = 960;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)

	stroke(240);
	textSize(50);
	fill(240);
	
	instance = new Instance(generateRandomArray(128), BubbleSort);
}

function draw() {
	background(0);
	if (!instance.sorted) {
		text(instance.frames, 10, 40)

		instance.update();

		let normalised_values = normalise(instance.values);

		for (let i = 0; i < instance.values.length; i++) {
			fill(255);
			for (let j = 0; j < instance.cursor.length; j++) {
				if (instance.cursor[j] == instance.values[j]) {
					fill(255, 0, 0);
				}
			}
			rect(i * instance.column_size, CANVAS_HEIGHT, instance.column_size, normalised_values[i] * -1);
		}
	
		if (instance.checkSorted()) {
			instance.sorted = true;
			noLoop();
		} 

	}

}