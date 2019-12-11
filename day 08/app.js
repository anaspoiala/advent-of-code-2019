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

function runPart2() {}

function getLayerWithLeastZeroes(layers) {
    return layers.sort(
        (layer1, layer2) => countDigit(0, layer1) - countDigit(0, layer2)
    )[0];
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

function separateLayers(width, height, imageDataArray) {
	let length = imageDataArray.length;
	let imageSize = width * height;
	let numberOfLayers = parseInt(length / imageSize);
	let layerSize = parseInt(length / numberOfLayers);

	let layers = [];
	let layerIndex = 0;
	for (let i = 0; i < length; i += layerSize) {
		layers[layerIndex] = imageDataArray.slice(i, i + layerSize);
		layerIndex++;
	}

	return layers;
}

function countDigit(digit, layer) {
	return layer.filter(d => d === digit).length;
}

