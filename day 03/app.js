const inputBox = document.getElementById("input");
const submitButton = document.getElementById("submitButton");
const resultText = document.getElementById("resultText");

submitButton.addEventListener("click", () => {
	let paths = inputBox.value.split("\n");
	let wirepath1 = paths[0].split(",");
	let wirepath2 = paths[1].split(",");
	let coord1 = getCoordinates(wirepath1);
	let coord2 = getCoordinates(wirepath2);

	let intersections = getAllIntersectionPoints(coord1, coord2);

	let distances = intersections.map(i => getManhattanDistance(i[0], i[1]));
	let minDistance = distances.reduce((min, current) => Math.min(min, current), distances[0]);
	console.log(distances);
	console.log(minDistance);
	resultText.innerHTML = minDistance;
});

const startPosition = [0, 0];

function getCoordinates(path) {
	let coordinates = [startPosition];
	let currentPos = startPosition.slice();

	for (let turn of path) {
		var [direction, steps] = getDirectionAndSteps(turn);

		switch (direction) {
			case "L":
				currentPos[1] -= steps;
				break;
			case "R":
				currentPos[1] += steps;
				break;
			case "U":
				currentPos[0] += steps;
				break;
			case "D":
				currentPos[0] -= steps;
				break;
		}

		coordinates.push(currentPos.slice());
	}

	return coordinates;
}

function getDirectionAndSteps(input) {
	let direction = input.substring(0, 1);
	let steps = parseInt(input.substring(1));
	return [direction, steps];
}

function getAllIntersectionPoints(coord1, coord2) {
	let intersections = [];

	for (let i = 1; i < coord1.length - 1; i++) {
		let line1 = [coord1[i], coord1[i + 1]];

		for (let j = 1; j < coord2.length - 1; j++) {
			let line2 = [coord2[j], coord2[j + 1]];

			if (areIntersecting(line1, line2)) {
				intersections.push([line2[0][0], line1[0][1]]);
			}
		}
	}

	return intersections;
}

function areIntersecting(line1, line2) {
	let x1 = line1[0][0];
	let y1 = line1[0][1];
	let x2 = line1[1][0];
	let y2 = line1[1][1];

	let a1 = line2[0][0];
	let b1 = line2[0][1];
	let a2 = line2[1][0];
	let b2 = line2[1][1];

	if (x1 === x2) {
		[x1, y1, x2, y2, a1, b1, a2, b2] = [a1, b1, a2, b2, x1, y1, x2, y2];
	}

	[x1, x2] = [Math.max(x1, x2), Math.min(x1, x2)];
	[y1, y2] = [Math.min(y1, y2), Math.max(y1, y2)];
	[a1, a2] = [Math.max(a1, a2), Math.min(a1, a2)];
	[b1, b2] = [Math.min(b1, b2), Math.max(b1, b2)];

	return (
		x1 >= a1 && a1 >= x2 && x1 >= a2 && a2 >= x2 && b1 <= y1 && y1 <= b2 && b1 <= y2 && y2 <= b2
	);
}

function getManhattanDistance(x, y) {
	return Math.abs(x) + Math.abs(y);
}
