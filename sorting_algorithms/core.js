/**
 * Contains all the shared functions for generating
 * unsorted arrays and other calculation functions
 */

class Instance {
	values = [];
	column_size;
	algorithm;
	frames = 0;
	sorted = false;

	constructor(values_, algorithm_) {
		this.values = values_;
		this.algorithm = new algorithm_
		this.column_size = CANVAS_WIDTH / this.values.length;
	}  

	checkSorted() { 
		for (let i = 1; i < this.values.length; i++) {
			if (this.values[i] < this.values[i - 1]) {
				return false;
			}
		}
		return true; 
	}

	update() {
		this.frames++;
		this.values = this.algorithm.sort(this.values);
	}
};

/**
 * Maps array to the canvas dimensions
 * 
 * @param {int[]} array an array to be mapped
 * 
 * @returns a normalised copy of the passed array,
 * mapped to the canvas dimensions os that the 
 */ 
function normalise(array) {
	let max_ = max(array) + 1;
	let min_ = min(array) - 1;

	let normalised_array = [];

	for (let i = 0; i < array.length; i++) {
		normalised_array[i] = map(array[i], min_, max_, 0, CANVAS_HEIGHT, true);
	}

	return normalised_array;
}

/**
 * Generates an unordered array of sequential integers
 * of size n and returns it
 * @param {int} size the size of the array to be generated
 * @returns the generated array
 */
function generateRandomArray(size) {
	let array_ = []
	for (let i = 0; i < size; i++) array_[i] = i;

	let temp, current, top = array_.length;
	if(top) {
		while(--top) {
			current = floor(random() * (top + 1));
			temp = array_[current];
			array_[current] = array_[top];
			array_[top] = temp;
		}
	}

	return array_;
}