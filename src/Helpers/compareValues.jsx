


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