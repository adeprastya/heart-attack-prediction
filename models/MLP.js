const Layer = require("./Layer.js");

class MLP {
	constructor({ numInputs, numHidden, numHidden2, numOutputs, activation }) {
		this.hiddenLayer = new Layer(numHidden, numInputs, activation);
		this.hiddenLayer2 = new Layer(numHidden2, numHidden, activation);
		this.outputLayer = new Layer(numOutputs, numHidden2, activation);
	}

	train(xData, yData, { learningRate, epochs }) {
		for (let epoch = 0; epoch < epochs; epoch++) {
			for (let i = 0; i < xData.length; i++) {
				const inputs = xData[i];
				const target = yData[i];

				// FORWARD PASS
				const hiddenOutputs = this.hiddenLayer.activate(inputs);
				const hiddenOutputs2 = this.hiddenLayer2.activate(hiddenOutputs);
				const outputs = this.outputLayer.activate(hiddenOutputs2);

				// BACKWARD PASS (Backpropagation)
				// Calculate output errors and deltas
				const outputErrors = target.map((t, j) => t - outputs[j]);
				const outputDeltas = outputErrors.map((error, j) => error * this.outputLayer.neurons[j].derivative(outputs[j]));

				// Calculate second hidden layer errors and deltas
				const hiddenErrors2 = this.hiddenLayer2.neurons.map((_, j) =>
					outputDeltas.reduce((acc, delta, k) => acc + delta * this.outputLayer.neurons[k].weights[j], 0)
				);
				const hiddenDeltas2 = hiddenErrors2.map(
					(error, j) => error * this.hiddenLayer2.neurons[j].derivative(hiddenOutputs2[j])
				);

				// Calculate first hidden layer errors and deltas
				const hiddenErrors = this.hiddenLayer.neurons.map((_, j) =>
					hiddenDeltas2.reduce((acc, delta, k) => acc + delta * this.hiddenLayer2.neurons[k].weights[j], 0)
				);
				const hiddenDeltas = hiddenErrors.map(
					(error, j) => error * this.hiddenLayer.neurons[j].derivative(hiddenOutputs[j])
				);

				// UPDATING WEIGHTS AND BIASES
				// Update output layer weights and biases
				this.outputLayer.neurons.forEach((neuron, j) => {
					neuron.weights.forEach((_, k) => {
						neuron.weights[k] += learningRate * outputDeltas[j] * hiddenOutputs2[k];
					});
					neuron.bias += learningRate * outputDeltas[j];
				});

				// Update second hidden layer weights and biases
				this.hiddenLayer2.neurons.forEach((neuron, j) => {
					neuron.weights.forEach((_, k) => {
						neuron.weights[k] += learningRate * hiddenDeltas2[j] * hiddenOutputs[k];
					});
					neuron.bias += learningRate * hiddenDeltas2[j];
				});

				// Update first hidden layer weights and biases
				this.hiddenLayer.neurons.forEach((neuron, j) => {
					neuron.weights.forEach((_, k) => {
						neuron.weights[k] += learningRate * hiddenDeltas[j] * inputs[k];
					});
					neuron.bias += learningRate * hiddenDeltas[j];
				});
			}
		}
	}

	predict(inputs) {
		const hiddenOutputs = this.hiddenLayer.activate(inputs);
		const hiddenOutputs2 = this.hiddenLayer2.activate(hiddenOutputs);
		return this.outputLayer.activate(hiddenOutputs2);
	}
}

module.exports = MLP;
