const inputBox = document.getElementById("input");
const submitButton = document.getElementById("submitButton");
const resultText = document.getElementById("resultText");
const desiredOutputText = document.getElementById("desiredOutput");
const submitButton2 = document.getElementById("submitButtonPart2");
const resultText2 = document.getElementById("resultText2");

// Intcode:
//
// 99 - program finished
// unknown code - something went wrong
// 1 - adds numbers read from 2 positions and stores result in 3rd position
// 2 - multiply next 2 positions, stores result in 3rd position
//
// after computing, move 4 positions ahead
// numbers after the code represent positions, not actual values!

/* 
    INPUT:
1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,10,1,19,1,6,19,23,1,23,13,27,2,6,27,31,1,5,31,35,2,10,35,39,1,6,39,43,1,13,43,47,2,47,6,51,1,51,5,55,1,55,6,59,2,59,10,63,1,63,6,67,2,67,10,71,1,71,9,75,2,75,10,79,1,79,5,83,2,10,83,87,1,87,6,91,2,9,91,95,1,95,5,99,1,5,99,103,1,103,10,107,1,9,107,111,1,6,111,115,1,115,5,119,1,10,119,123,2,6,123,127,2,127,6,131,1,131,2,135,1,10,135,0,99,2,0,14,0

*/

submitButton.addEventListener("click", () => {
	let program = inputBox.value.split(",").map(Number);

	// first replace position 1 with value 12 and position 2 with value 2
	program[1] = 12;
	program[2] = 2;

	let result = restoreGravityAssistProgram(program);

	resultText.innerHTML = result[0];
});

submitButton2.addEventListener("click", () => {
	let desiredOutput = parseInt(desiredOutputText.value);
    let noun, verb;
    
	for (noun = 0; noun <= 99; noun++) {
		for (verb = 0; verb <= 99; verb++) {
            // Reset memory
            let program = inputBox.value.split(",").map(Number);

            // Compute result for (noun, verb) pair
            program[1] = noun;
            program[2] = verb;
			let result = restoreGravityAssistProgram(program);

			if (result[0] === desiredOutput) {
				resultText2.innerHTML = 100 * noun + verb;
				return;
			}
		}
	}
});

function restoreGravityAssistProgram(program) {
	let i;

	for (i = 0; i < program.length; i += 4) {
		let code = program[i];
		let inputPos1 = program[i + 1];
		let inputPos2 = program[i + 2];
		let outputPos = program[i + 3];

		if (code === 1) {
			program[outputPos] = program[inputPos1] + program[inputPos2];
		} else if (code === 2) {
			program[outputPos] = program[inputPos1] * program[inputPos2];
		} else if (code === 99) {
			return program;
		} else {
			return `Something went wrong at position ${i} (${program[i]})`;
		}
	}
};
