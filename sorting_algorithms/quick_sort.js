class QuickSort {
	values = [];
	// it works but isnt animated
	// need some sort of state storage for
	// the functions so that the current 
	// state isnt lost when returning to the 
	// draw function

	sort(values) {
		this.values = values;
		return this.quickSort(this.values, 0, this.values.length - 1);
	}
	
	quickSort(values, start, end) {
		// optionally check if values is less than 2
		// this implementation uses the first element as the pivot
		if (start < end) {
			let partition = this.partition(values, start, end);
		
			this.quickSort(values, start, partition - 1);
			this.quickSort(values, partition + 1, end);			
		}
		return this.values;
	}
	
	partition(values, start, end) {
		let pivot = values[start];
		let left_index = start;
		let right_index = end;

		while (left_index < right_index) {
			// Will always execute at least once
			while (values[left_index] <= pivot && left_index < end) {
				++left_index;
			}
			while (values[right_index] > pivot && right_index > start) {
				--right_index;
			}

			if (left_index < right_index) {
				this.swap(left_index, right_index);
				
			}

		};
		this.swap(start, right_index);
		return right_index;
	}

	swap(position1, position2) {
		let temp = this.values[position1];
		this.values[position1] = this.values[position2];
		this.values[position2] = temp;
	}

	update() {
		return this.values;
	}
};