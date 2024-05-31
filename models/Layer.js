const Neuron = require("./Neuron.js");

class Layer {
	constructor(numNeurons, numInputs, activation) {
		this.neurons = Array.from({ length: numNeurons }, () => new Neuron(numInputs, activation));
	}

	activate(inputs) {
		return this.neurons.map((neuron) => neuron.activate(inputs));
	}
}

module.exports = Layer;
