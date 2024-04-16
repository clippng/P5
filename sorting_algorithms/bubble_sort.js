class BubbleSort {
	async sort(values) {
		let temp;
		for (let i = 0; i < values.length - 1; i++) {
			await sleep(10);
			if (values[i] > values[i + 1]) {
				temp = values[i];
				values[i] = values[i + 1];
				values[i + 1] = temp;
			}
		}
		return values;
	}
};

// add optimisations to clamp the comparison loop outside of the already sorted values