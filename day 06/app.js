const inputBox = document.getElementById("input");
const submitButton = document.getElementById("submitButton");
const submitButton2 = document.getElementById("submitButton2");
const resultText = document.getElementById("resultText");

submitButton.addEventListener("click", () => {
	let orbits = parseInput();

	var orbitCount = computeTotalNumberOfOrbits(orbits);
	resultText.innerHTML = orbitCount;
});

submitButton2.addEventListener("click", () => {
	let orbits = parseInput();
	let youPath = getPath("YOU", orbits).reverse();
	let sanPath = getPath("SAN", orbits).reverse();

	console.log(youPath);
	console.log(sanPath);

	while (true) {
		
		console.log(`${youPath[0]} === ${sanPath[0]}`);

		if (youPath[0] === sanPath[0]) {

			youPath.shift();
			sanPath.shift();

			console.log(youPath);
			console.log(sanPath);
		} else {
			break;
		}
	}
	
	let minimumPathLength = youPath.length + sanPath.length - 2; // -2 because YOU and SAN are not considered
	
	resultText.innerHTML = minimumPathLength;
});

function parseInput() {
	let mapData = inputBox.value.split("\n");
	let orbits = new Map();
	
	// child based map
	for (let entry of mapData) {
		let [parent, child] = entry.split(")");

		orbits.set(child, parent);
	}
	
	return orbits;
}

function computeTotalNumberOfOrbits(orbits) {

	let sum = 0;

	for (let [child, parent] of orbits) {
		sum += computeNumberOfOrbits(child, orbits);
	}

	return sum;
}

function computeNumberOfOrbits(child, orbits) {

	if (child === "COM")
		return 0;

	return 1 + computeNumberOfOrbits(orbits.get(child), orbits);
}

function getPath(child, orbits) {

	if (child === "COM")
		return ["COM"];

	return [child].concat(getPath(orbits.get(child), orbits));
}

