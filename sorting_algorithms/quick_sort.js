class QuickSort {
	sort(values) {
		return this.quickSort(values, 0, values.length - 1);
	}
	
	quickSort(values, start, end) {
		let partition_ = this.partition(values, start, end);
		//this.quickSort(values, start, partition_);
		//this.quickSort(values, partition_ + 1, end);
	}
	
	partition(values, start, end) {
		let pivot = values[start];
		let left_index = start - 1;
		let right_index = end + 1;

		do {
			// Will always execute at least once
			while (values[left_index] < pivot) {
				++left_index;
			}
			while (values[right_index] > pivot) {
				--right_index;
			}

			if (left_index >= right_index) {
				console.log("working")
				return right_index;
			}

			let temp = values[left_index];
			values[left_index] = values[right_index];
			values[right_index] = temp;
		} while (!left_index >= right_index);
	}
};