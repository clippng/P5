/**
 * Contains all the shared functions for generating
 * unsorted arrays and other calculation functions
 */

let values = []; // values to be sorted
let column_size;

let cooldown = 5; // frames between sorts
let sorted = false;
let attempts = 0;

let algorithm;

const Core = {

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
 * Checks if an array is in numerical order
 * 
 * @param {int[]} array an array to be examined
 * 
 * @returns true when the array is sorted and false in 
 * all other cases
 */
function checkSorted(array) { 
	for (let i = 1; i < array.length; i++) {
		if (array[i] < array[i - 1]) {
			return false;
		} 
	}
	return true;
}

/**
 * 
 * @param {*} size 
 * @returns 
 */
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

// 
function update() {

}

function updateCursor(x) {
	// should point to the current point being evaluated, might not work currently becuase of for loops
	fill(255, 0, 0);
	rect(x, 0, column_size, CANVAS_HEIGHT)
}
