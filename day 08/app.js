const inputImageData = document.getElementById("input");
const inputWidth = document.getElementById("inputWidth");
const inputHeight = document.getElementById("inputHeight");
const part1Button = document.getElementById("part1Button");
const part2Button = document.getElementById("part2Button");
const resultText = document.getElementById("result");

part1Button.addEventListener("click", () => {
	runPart1();
});

part2Button.addEventListener("click", () => {
	runPart2();
});

function runPart1() {
	let imageData = readImageData();
	let [width, height] = readImageSize();
	let layers = separateLayers(width, height, imageData);

	let layerWithLeastZeroes = getLayerWithLeastZeroes(layers);

	let noOfOneMultipiedByNoOfTwoDigits =
		countDigit(1, layerWithLeastZeroes) * countDigit(2, layerWithLeastZeroes);

	displayOutput(noOfOneMultipiedByNoOfTwoDigits);
}

function runPart2() {
	let imageData = readImageData();
	let [width, height] = readImageSize();
	let layers = separateLayers(width, height, imageData);
	let layerSize = width * height;

	let decodedImage = [];

	for (let i = 0; i < layerSize; i++) {
		decodedImage.push(getPixelColor(layers, i));
	}

	let matrix = arrayToMatrix(decodedImage, width);
	displayImage(matrix);
}

function readImageData() {
	return inputImageData.value.split("").map(Number);
}

function readImageSize() {
	return [Number(inputWidth.value), Number(inputHeight.value)];
}

function displayOutput(output) {
	resultText.innerHTML = output;
}

function displayImage(matrix) {
	let result = '<p style="font-family:monospace"><pre>';
	for (let line of matrix) {
		let lineHTML = line
			.toString()
			.split(",")
			.join("")
			.replace(/1/g, "#")
			.replace(/0/g, " ");
		result += lineHTML + "\n";
	}

	result += "</pre></p>";

	resultText.innerHTML = result;
}

/**
 * Returns an array of arrays representing the layers present in the image.
 */
function separateLayers(width, height, imageDataArray) {
	let length = imageDataArray.length;
	let imageSize = width * height;

	let layers = [];
	let layerIndex = 0;
	for (let i = 0; i < length; i += imageSize) {
		layers[layerIndex] = imageDataArray.slice(i, i + imageSize);
		layerIndex++;
	}

	return layers;
}

function countDigit(digit, layer) {
	return layer.filter(d => d === digit).length;
}

/**
 * Sorts layers ascending by the number of zeroes on it and returns first element.
 */
function getLayerWithLeastZeroes(layers) {
	return layers.sort((layer1, layer2) => countDigit(0, layer1) - countDigit(0, layer2))[0];
}

/**
 * Returns first pixel with value different from 2.
 * Returns 2 if no other value is found.
 */
function getPixelColor(layers, index) {
	let layerIndex = 0;

	while (layerIndex < layers.length) {
		let pixel = layers[layerIndex][index];

		if (pixel !== 2) {
			return pixel;
		}

		layerIndex++;
	}

	return 2; // default return value
}

function arrayToMatrix(array, elemsPerLine) {
	let result = [];

	for (let i = 0; i < array.length; i += elemsPerLine) {
		result.push(array.slice(i, i + elemsPerLine));
	}

	return result;
}
