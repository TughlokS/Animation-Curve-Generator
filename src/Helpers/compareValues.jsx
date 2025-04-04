


/* -------------- COMPARES BEZIER VALUES AND RETURNS A BOOLEAN -------------- */
export const areBezierValuesEqual = (bv1, bv2, epsilon = 0.001) => {
	const isEqual = (a, b) => Math.abs(a - b) < epsilon;

	return (
		isEqual(bv1.cp1.X, bv2.cp1.X) &&
		isEqual(bv1.cp1.Y, bv2.cp1.Y) &&
		isEqual(bv1.cp2.X, bv2.cp2.X) &&
		isEqual(bv1.cp2.Y, bv2.cp2.Y)
	);
};


/* --------------------- checks if bezierValue is valid --------------------- */
export const isValidBezierValue = (value) => {
	if (value &&
		value.cp1 &&
		typeof value.cp1.X === 'number' &&
		typeof value.cp1.Y === 'number' &&
		value.cp2 &&
		typeof value.cp2.X === 'number' &&
		typeof value.cp2.Y === 'number'
	) {
		return true;
	}

	return false;
};