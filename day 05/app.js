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

const inputsText = document.getElementById("inputs");
const inputProgramText = document.getElementById("inputProgram");
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
	let input = parseInput(inputsText);
	let output = [];
	let program = parseInput(inputProgramText);

	// Compute result
	let intcodeParser = new IntcodeParser(program, input, output);
	console.log("Begin parsing program...");
	intcodeParser.parseProgram();

	// Display result
	resultText.innerHTML = intcodeParser.getDiagnosticCode();
}

function runPart2() {
	// Get input
	let input = parseInput(inputsText);
	let output = [];
	let program = parseInput(inputProgramText);

	// Compute result
	let intcodeParser = new IntcodeParser(program, input, output);
	console.log("Begin parsing program...");
	intcodeParser.parseProgram();

	// Display result
	resultText.innerHTML = intcodeParser.getDiagnosticCode();
}

function parseInput(inputText) {
	return inputText.value.split(",").map(Number);
}
