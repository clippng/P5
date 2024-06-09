class BubbleSort {
	sort(values) {
		let upper_range = this.findUpperRange(values);
		let lower_range = this.findLowerRange(values);
		for (let i = lower_range; i < upper_range; i++) {
			if (values[i] > values[i + 1]) {
				let temp = values[i];
				values[i] = values[i + 1];
				values[i + 1] = temp;

				return values
			}
		}
	}

	// this probably slows the algorithm down
	findLowerRange(values) {
		let lower_range = 0;
	 	while(values[lower_range] < values[lower_range + 1]) {
			lower_range++;
		} return lower_range;
	}
	// this literally does nothing
	findUpperRange(values) {
		let upper_range = values.length;
		while (values[upper_range] > values[upper_range - 1]) {
			upper_range--;
		} return upper_range;
	}
};

