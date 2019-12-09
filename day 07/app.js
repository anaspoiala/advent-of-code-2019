// =============================== Instructions ===============================

class Instruction {
	constructor(instruction, pointerIncrementValue) {
		this.instruction = instruction;
		this.pointerIncrementValue = pointerIncrementValue;
	}

	static getOptcode(instruction) {
		return instruction % 100;
	}

	nextPointerPosition(currentPointer) {
		return currentPointer + this.pointerIncrementValue;
	}

	getParameterMode(instruction, paramNumber) {
		let parameterModes = Math.floor(instruction / 100);
		return Math.floor(parameterModes / Math.pow(10, paramNumber - 1)) % 10;
	}

	readNextInput(inputArray) {
		return inputArray.shift();
	}

	getParameterValue(program, paramNumber, pointer) {
		// If parameter is in position mode
		return this.getParameterMode(this.instruction, paramNumber) == 0
			? // Return value at specified position.
			  program[program[pointer + paramNumber]]
			: // Else return value.
			  program[pointer + paramNumber];
	}

	execute(program, pointer, inputs, outputs) {}
}

class HaltInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 1);
	}

	execute(program, pointer, inputs, outputs) {
		return;
	}
}

class AddInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 4);
	}

	execute(program, pointer, inputs, outputs) {
		let param1 = this.getParameterValue(program, 1, pointer);
		let param2 = this.getParameterValue(program, 2, pointer);
		let outputPosition = program[pointer + 3];

		program[outputPosition] = param1 + param2;
	}
}

class MultiplyInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 4);
	}

	execute(program, pointer, inputs, outputs) {
		let param1 = this.getParameterValue(program, 1, pointer);
		let param2 = this.getParameterValue(program, 2, pointer);
		let outputPosition = program[pointer + 3];

		program[outputPosition] = param1 * param2;
	}
}

class ReadInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 2);
	}

	execute(program, pointer, inputs, outputs) {
		let outputPosition = program[pointer + 1];
		let readInput = this.readNextInput(inputs);

		program[outputPosition] = readInput;
	}
}

class WriteInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 2);
	}

	execute(program, pointer, inputs, outputs) {
		//let outputPosition = program[pointer + 1];
		//let outputValue = program[outputPosition];
		let outputValue = this.getParameterValue(program, 1, pointer);
		outputs.push(outputValue);
	}
}

class JumpIfTrueInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 3);
		this.pointerPosition = 0;
	}

	nextPointerPosition(currentPointer) {
		return this.pointerPosition;
	}

	execute(program, pointer, inputs, outputs) {
		let param1 = this.getParameterValue(program, 1, pointer);
		if (param1 !== 0) {
			this.pointerPosition = this.getParameterValue(program, 2, pointer);
		} else {
			this.pointerPosition = pointer + 3;
		}
	}
}

class JumpIfFalseInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 3);
		this.pointerPosition = 0;
	}

	nextPointerPosition(currentPointer) {
		return this.pointerPosition;
	}

	execute(program, pointer, inputs, outputs) {
		let param1 = this.getParameterValue(program, 1, pointer);
		if (param1 === 0) {
			this.pointerPosition = this.getParameterValue(program, 2, pointer);
		} else {
			this.pointerPosition = pointer + 3;
		}
	}
}

class LessThanInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 4);
	}

	execute(program, pointer, inputs, outputs) {
		let param1 = this.getParameterValue(program, 1, pointer);
		let param2 = this.getParameterValue(program, 2, pointer);
		let outputPosition = program[pointer + 3];

		program[outputPosition] = param1 < param2 ? 1 : 0;
	}
}

class EqualsInstruction extends Instruction {
	constructor(instruction) {
		super(instruction, 4);
	}

	execute(program, pointer, inputs, outputs) {
		let param1 = this.getParameterValue(program, 1, pointer);
		let param2 = this.getParameterValue(program, 2, pointer);
		let outputPosition = program[pointer + 3];

		program[outputPosition] = param1 === param2 ? 1 : 0;
	}
}

// =============================== Parser ===============================

class IntcodeParser {
	constructor(program, input, output) {
		this.program = program.slice();
		this.input = input.slice();
		this.output = output.slice();
		this.pointer = 0;
		this.hasFinished = false;
	}

	parseProgram() {
		this.pointer = 0;

		while (this.pointer < this.program.length) {
			let currentInstruction = this.program[this.pointer];
			let optcode = Instruction.getOptcode(currentInstruction);
			let instruction;

			switch (optcode) {
				case 1:
					instruction = new AddInstruction(currentInstruction);
					break;
				case 2:
					instruction = new MultiplyInstruction(currentInstruction);
					break;
				case 3:
					instruction = new ReadInstruction(currentInstruction);
					break;
				case 4:
					instruction = new WriteInstruction(currentInstruction);
					break;
				case 5:
					instruction = new JumpIfTrueInstruction(currentInstruction);
					break;
				case 6:
					instruction = new JumpIfFalseInstruction(currentInstruction);
					break;
				case 7:
					instruction = new LessThanInstruction(currentInstruction);
					break;
				case 8:
					instruction = new EqualsInstruction(currentInstruction);
					break;
				case 99:
					instruction = new HaltInstruction(currentInstruction);
					break;
				default:
					console.log(
						`Something went wrong at position ${this.pointer} (instruction=${currentInstruction}, optcode=${optcode})`
					);
					return;
			}

			console.log(
				`Parsing instruction ${currentInstruction} (${
					instruction.constructor.name
				}, prevPointer=${this.pointer}, nextPointer=${instruction.nextPointerPosition(
					this.pointer
				)})`
			);

			if (instruction instanceof HaltInstruction) {
				this.hasFinished = true;
				return;
			}

			instruction.execute(this.program, this.pointer, this.input, this.output);
			this.pointer = instruction.nextPointerPosition(this.pointer);
		}
	}

	getDiagnosticCode() {
		return this.output[this.output.length - 1];
	}

	getOutput() {
		return this.output.slice();
	}

	getProgram() {
		return this.program.slice();
	}
}

// ==============================================================

const inputParseSetting = document.getElementById("inputParseSetting");
const inputProgramText = document.getElementById("input");
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
	// Get input
	//let phaseSetting = parseInput(inputParseSetting);
	let program = parseInput(inputProgramText);

	// Compute result
	let possiblePhaseSettings = getAllPermutations([0, 1, 2, 3, 4]);

	let maxPhaseSetting = possiblePhaseSettings[0];
	let maxOutputSignal = computeOutputSignalForPhaseSetting(maxPhaseSetting, program);

	for (let phaseSetting of possiblePhaseSettings) {
		console.log(`Trying phase setting sequence ${phaseSetting}.`);

		let outputSignal = computeOutputSignalForPhaseSetting(phaseSetting, program);
		if (outputSignal > maxOutputSignal) {
			maxPhaseSetting = phaseSetting.slice();
			maxOutputSignal = outputSignal;
		}
	}

	// Display result
	resultText.innerHTML = `Maximum output signal is ${maxOutputSignal} (from phase setting sequence ${maxPhaseSetting})`;
}

function runPart2() {
	// Get input
	//let phaseSetting = parseInput(inputParseSetting);
	let program = parseInput(inputProgramText);

	// Compute result
	let possiblePhaseSettings = getAllPermutations([5, 6, 7, 8, 9]);

	let maxPhaseSetting = possiblePhaseSettings[0];
	let maxOutputSignal = computeOutputSignalForPhaseSettingWithFeedbackLoop(
		maxPhaseSetting,
		program
	);

	for (let phaseSetting of possiblePhaseSettings) {
		console.log(
			`>>> Trying phase setting sequence ${phaseSetting}. Current max is ${maxOutputSignal}`
		);

		let outputSignal = computeOutputSignalForPhaseSettingWithFeedbackLoop(
			phaseSetting,
			program
		);

		if (outputSignal > maxOutputSignal) {
			maxPhaseSetting = phaseSetting.slice();
			maxOutputSignal = outputSignal;
		}
	}

	// Display result
	resultText.innerHTML = `Maximum output signal is ${maxOutputSignal} (from phase setting sequence ${maxPhaseSetting})`;
}

function parseInput(inputText) {
	return inputText.value.split(",").map(Number);
}

function computeOutputSignalForPhaseSetting(phaseSetting, program) {
	let previousOutput = 0;
	for (let amplifier = 0; amplifier < 5; amplifier++) {
		let output = [];
		let input = [phaseSetting[amplifier], previousOutput];
		let intcodeParser = new IntcodeParser(program, input, output);

		intcodeParser.parseProgram();
		previousOutput = intcodeParser.getDiagnosticCode();
	}

	return previousOutput;
}

function computeOutputSignalForPhaseSettingWithFeedbackLoop(phaseSetting, program) {
	// let amplifier = 0;
	// let previousOutput = 0;
	// let intcodeParsers = Array(5).fill(new IntcodeParser(program, [], []));


	// // while last amplifier hasn't finished
	// while (!intcodeParsers[4].hasFinished) {
	// 	console.log(`Amplifier #${amplifier}`);

	// 	intcodeParsers[amplifier].input = [phaseSetting[amplifier], previousOutput];
	// 	intcodeParsers[amplifier].parseProgram();

	// 	previousOutput = intcodeParsers[amplifier].getDiagnosticCode();

	// 	if (amplifier === 4) {
	// 		amplifier = 0;
	// 	} else {
	// 		amplifier++;
	// 	}
	// }


	// return previousOutput;
}

function getAllPermutations(array) {
	let result = [];

	if (array.length === 1) {
		return array;
	}

	for (let i = 0; i < array.length; i++) {
		let current = [array[i]];
		let elementsLeft = array.slice(0, i).concat(array.slice(i + 1));
		let innerPerm = getAllPermutations(elementsLeft);

		for (let j = 0; j < innerPerm.length; j++) {
			result.push(current.concat(innerPerm[j]));
		}
	}

	return result;
}
