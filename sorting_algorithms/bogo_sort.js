class BogoSort {
	sort(values) {
		let sorted_values = [];
		for (let i = 0; i < values.length; i++) {
			let r = random(1);
			if (r < 0.5) {
				sorted_values.push(values[i]);
			} else {
				sorted_values.unshift(values[i]);
			}
		}
		return sorted_values;
	}
};
