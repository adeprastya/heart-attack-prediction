class Activation {
	sigmoid(x) {
		return 1 / (1 + Math.exp(-x));
	}
	sigmoidDerivative(x) {
		const sig = this.sigmoid(x);
		return sig * (1 - sig);
	}

	tanh(x) {
		return Math.tanh(x);
	}
	tanhDerivative(x) {
		return 1 - Math.pow(Math.tanh(x), 2);
	}

	relu(x) {
		return Math.max(0, x);
	}
	reluDerivative(x) {
		return x > 0 ? 1 : 0;
	}
}

class Neuron extends Activation {
	constructor(numInputs, activation) {
		super();
		this.weights = Array.from({ length: numInputs }, () => Math.random() * 2 - 1);
		this.bias = Math.random() * 2 - 1;
		this.activation = activation;
	}

	activate(inputs) {
		const sum = inputs.reduce((acc, input, i) => acc + input * this.weights[i], this.bias);

		switch (this.activation) {
			case "sigmoid":
				return this.sigmoid(sum);
			case "tanh":
				return this.tanh(sum);
			case "relu":
				return this.relu(sum);
			default:
				console.error(`Invalid activation function: ${this.activation}`);
				break;
		}
	}

	derivative(value) {
		switch (this.activation) {
			case "sigmoid":
				return this.sigmoidDerivative(value);
			case "tanh":
				return this.tanhDerivative(value);
			case "relu":
				return this.reluDerivative(value);
			default:
				console.error(`Invalid activation function: ${this.activation}`);
				break;
		}
	}
}

module.exports = Neuron;
