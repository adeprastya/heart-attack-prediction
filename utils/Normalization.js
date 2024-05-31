class Normalization {
	constructor(data) {
		const { maxValues, minValues } = this.calculateParameters(data);
		this.maxValues = maxValues;
		this.minValues = minValues;
	}

	calculateParameters(data) {
		const maxValues = Array(data[0].length).fill(Number.NEGATIVE_INFINITY);
		const minValues = Array(data[0].length).fill(Number.POSITIVE_INFINITY);

		data.forEach((row) => {
			row.forEach((value, i) => {
				if (value > maxValues[i]) maxValues[i] = value;
				if (value < minValues[i]) minValues[i] = value;
			});
		});

		return { maxValues, minValues };
	}

	normalizeData(data) {
		return data.map((row) => this.normalizeRow(row));
	}

	normalizeRow(row) {
		return row.map((value, i) => {
			if (this.maxValues[i] === this.minValues[i]) {
				return 0;
			}
			return (value - this.minValues[i]) / (this.maxValues[i] - this.minValues[i]);
		});
	}
}

module.exports = Normalization;
