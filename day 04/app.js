let from = 123257;
let to = 647015;

function countPasswordsWithinRange() {
	let passwordCount = 0;

	for (let potentialPassword = from; potentialPassword <= to; potentialPassword++) {
		if (meetsCriteria(potentialPassword)) {
			passwordCount++;
		}
	}

	return passwordCount;
}

function meetsCriteria(password, ignoreRange = false) {
	let passwordString = password.toString();

	if (passwordString.length != 6) {
		return false;
	}

	if (!ignoreRange && (password < from || password > to)) {
		return false;
	}

	let previous = passwordString[0];
	let containsDouble = false;
	let digitGroupLength = 1;

	for (let i = 1; i < passwordString.length; i++) {
		let current = passwordString[i];

		if (current === previous) {
			digitGroupLength++;
		} else {
			if (digitGroupLength === 2) {
				containsDouble = true;
			}

			digitGroupLength = 1;

			if (current < previous) {
				return false;
			}
		}

		previous = current;
	}

	if (digitGroupLength === 2) {
		containsDouble = true;
	}

	return containsDouble;
}

console.log(meetsCriteria(112233, true));
console.log(meetsCriteria(123444, true));
console.log(meetsCriteria(111122, true));
console.log(meetsCriteria(111123, true));
console.log(meetsCriteria(111222, true));
console.log(meetsCriteria(111223, true));

console.log(countPasswordsWithinRange());

