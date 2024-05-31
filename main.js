const { getTrainData } = require("./utils/TrainData.js");
const Normalization = require("./utils/Normalization.js");
const MLP = require("./models/MLP.js");

async function main(arch, param) {
	try {
		const { xData, yData } = await getTrainData("./data/Medicaldataset.csv");
		const normalization = new Normalization(xData);
		const normalizedXData = normalization.normalizeData(xData);

		const xDataTrain = normalizedXData.slice((normalizedXData.length / 100) * 20);
		const yDataTrain = yData.slice((normalizedXData.length / 100) * 20);

		const xDataValidation = normalizedXData.slice(
			(normalizedXData.length / 100) * 20,
			(normalizedXData.length / 100) * 40
		);
		const yDataValidation = yData.slice((normalizedXData.length / 100) * 20, (normalizedXData.length / 100) * 40);

		const xDataTest = normalizedXData.slice(0, (normalizedXData.length / 100) * 20);
		const yDataTest = yData.slice(0, (normalizedXData.length / 100) * 20);

		console.time("TIME__");
		const mlp = new MLP(arch);
		mlp.train(xDataTrain, yDataTrain, param);

		// validation
		let valCorrect = 0;
		let valWrong = 0;
		xDataValidation.forEach((data, i) => {
			const prediction = mlp.predict(data);
			(prediction > param.treshold ? 1 : 0) == yDataValidation[i] ? valCorrect++ : valWrong++;
			// console.log(`${i}\noutput: ${prediction} ${prediction > param.treshold ? 1 : 0} == ${yData[i]}\n`);
		});

		// test
		let testCorrect = 0;
		let testWrong = 0;
		xDataTest.forEach((data, i) => {
			const prediction = mlp.predict(data);
			(prediction > param.treshold ? 1 : 0) == yDataTest[i] ? testCorrect++ : testWrong++;
			// console.log(`${i}\noutput: ${prediction} ${prediction > param.treshold ? 1 : 0} == ${yData[i]}\n`);
		});

		console.log(
			`\nVALIDATION__:  correct: ${valCorrect} wrong: ${valWrong} accuration: ${(
				(valCorrect / (valCorrect + valWrong)) *
				100
			).toFixed(2)}%`
		);
		console.log(
			`TEST__:  correct: ${testCorrect} wrong: ${testWrong} accuration: ${(
				(testCorrect / (testCorrect + testWrong)) *
				100
			).toFixed(2)}%`
		);
		console.timeEnd("TIME__");
	} catch (e) {
		console.error(e);
	}
}

// model
const arch = {
	numInputs: 8,
	numHidden: 22,
	numHidden2: 20,
	numOutputs: 1,
	activation: "tanh"
};
const param = {
	learningRate: 0.001,
	epochs: 4000,
	treshold: 0.55
};

main(arch, param);
