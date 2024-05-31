const fs = require("fs");

async function getTrainData(file) {
	const xData = [];
	const yData = [];

	try {
		const data = await fs.promises.readFile(file, "utf8");
		const rows = data.split("\n");

		for (let i = 1; i < rows.length - 1; i++) {
			const cols = rows[i].split(",");

			if (cols.length < rows[0].split(",").length) continue;

			const xDataItem = [];
			const yDataItem = [];

			for (let j = 0; j < cols.length; j++) {
				if (j < cols.length - 1) {
					xDataItem.push(parseFloat(cols[j]) || 0);
				} else {
					cols[j] == "positive\r" ? yDataItem.push(1) : yDataItem.push(0);
				}
			}

			xData.push(xDataItem);
			yData.push(yDataItem);
		}

		return { xData, yData };
	} catch (error) {
		throw error;
	}
}

module.exports = { getTrainData };
