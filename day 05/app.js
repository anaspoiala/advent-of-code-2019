// Intcode:
//
// Code 99 - program finished
// Code 1  - adds numbers read from 2 positions and stores result in 3rd position
// Code 2  - multiply next 2 positions, stores result in 3rd position
//
// Code 3  - read input, 1 parameter (the position);
//		   - saves an integer input on the given position
//
// Code 4  - write output, 1 parameter (the position);
// 		   - outputs the value from the given position
//
// Code 5  - jump-if-true, 2 params;
//		   - if param1 is non-zero, it sets the instruction pointer to the value from param2
//		   - otherwise, it does nothing
//
// Code 6  - jump-if-false, 2 params;
//		   - if param1 is zero, it sets the instruction pointer to the value from param2
//		   - otherwise, it does nothing
//
// Code 7  - less than, 3 params;
//		   - if param1 < param2, it stores 1 in the position given by param3
//		   - otherwise, it stores 0
//
// Code 8  - equals, 3 params;
//		   - if param1 == param2, it stores 1 in the position given by param3
//		   - otherwise, it stores 0
//
// Unknown Code - something went wrong
//
// Parameter Modes (stored in the same value as the instruction's optcode)
// 1. Position Mode (0)
//		= parameters interpreted as positions
//		- ex.: parameter = 50 => it's value is stored at position 50 in memory
// 2. Immediate Mode (1)
//		= parameters interpreted as values
//		- ex.: parameter = 50 => it's value is 50
//
// Optcode = two-digit number
//
// Example:
// ABCDE
//  1002
//  DE - two-digit opcode,      02 == opcode 2
//   C - mode of 1st parameter,  0 == position mode
//   B - mode of 2nd parameter,  1 == immediate mode
//   A - mode of 3rd parameter,  0 == position mode, omitted due to being a leading zero
//
// !!! Parameters that an instruction writes to will neved be in Immediate Mode !!!
//
//

const inputProgramText = document.getElementById("inputProgram");
const inputsText = document.getElementById("inputs");
const part1Button = document.getElementById("part1Button");
const part2Button = document.getElementById("part2Button");
const resultText = document.getElementById("result");

part1Button.addEventListener("click", () => {
	runPart1();
});

part2Button.addEventListener("click", () => {});

function runPart1() {
	// Get input
	let inputs = [1];
	let program = parseInput(inputProgramText);

	// Compute result
	let outputs = [];
	parseProgram(program, inputs, outputs);

	// Display result
	resultText.innerHTML = outputs;
}

function runPart2() {
	// Get input
	let inputs = [5];
	let program = parseInput(inputProgramText);

	// Compute result
	let outputs = [];
	parseProgram(program, inputs, outputs);

	// Display result
	resultText.innerHTML = outputs;
}

function parseInput(inputText) {
	return inputText.value.split(",").map(Number);
}

function parseProgram(program, inputs, outputs) {
	let param1, param2, outputPosition, readInput, outputValue;
	for (let i = 0; i < program.length; ) {
		let instruction = program[i];
		let optcode = getOptcode(instruction);

		switch (optcode) {
			case 1:
				// Add param1 and param2. Store result at position param3 (outputPosition).
				param1 = getParameterValue(program, instruction, 1, i);
				param2 = getParameterValue(program, instruction, 2, i);
				outputPosition = program[i + 3]; // output param is always in position mode

				program[outputPosition] = param1 + param2;

				i += 4; // increment
				break;
			case 2:
				// Multiply param1 and param2. Store result at position param3 (outputPosition).
				param1 = getParameterValue(program, instruction, 1, i);
				param2 = getParameterValue(program, instruction, 2, i);
				outputPosition = program[i + 3]; // output param is always in position mode

				program[outputPosition] = param1 * param2;

				i += 4; // increment
				break;
			case 3:
				// Read from input. Save input at position param1 (outputPosition).
				outputPosition = program[i + 1];

				readInput = readNextInput(inputs);

				program[outputPosition] = readInput;

				i += 2; // increment
				break;
			case 4:
				// Write to output. Write value from position param1 (inputPosition).
				outputPosition = program[i + 1];

				outputValue = program[outputPosition];

				outputs.push(outputValue);

				i += 2; // increment
				break;
			case 99:
				return; // program;
			default:
				return `Something went wrong at position ${i} (instruction=${program[i]}, optcode=${optcode})`;
		}
	}
}

function getParameterValue(program, instruction, paramNumber, pos) {
	// If parameter is in position mode
	return getParameterMode(instruction, paramNumber) == 0
		? // Return value at specified position.
		  program[program[pos + paramNumber]]
		: // Else return value.
		  program[pos + paramNumber];
}

function getOptcode(instruction) {
	return instruction % 100;
}

function getParameterMode(instruction, paramNumber) {
	let parameterModes = Math.floor(instruction / 100);
	return Math.floor(parameterModes / Math.pow(10, paramNumber - 1)) % 10;
}

function readNextInput(inputArray) {
	return inputArray.shift();
}
