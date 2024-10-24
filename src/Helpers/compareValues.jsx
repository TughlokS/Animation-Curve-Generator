


/* -------------- COMPARES BEZIER VALUES AND RETURNS A BOOLEAN -------------- */
export const areBezierValuesEqual = (bv1, bv2) => {
	return (
		bv1.cp1.X === bv2.cp1.X &&
		bv1.cp1.Y === bv2.cp1.Y &&
		bv1.cp2.X === bv2.cp2.X &&
		bv1.cp2.Y === bv2.cp2.Y
	);
};