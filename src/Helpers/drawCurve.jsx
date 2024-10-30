import { getCanvasPosition } from '../Helpers/drawGrid'
import { bezierCurveColors } from './env';



export const drawCurve = (ctx, controlPoint1 = { X: 0.25, Y: 0.1 }, controlPoint2 = { X: 0.25, Y: 0.1 }) => {
	// define curve colors
	const startPointColor = bezierCurveColors.startPointColor_dark;
	const endPointColor = bezierCurveColors.endPointColor_dark;
	const gradientColorStart = bezierCurveColors.startPointGradient_dark;
	const gradientColorEnd = bezierCurveColors.endPointGradient_dark;

	// set the points 
	const startPoint = getCanvasPosition(0, 0);
	const endPoint = getCanvasPosition(1, 1);
	controlPoint1 = getCanvasPosition(controlPoint1.X, controlPoint1.Y);
	controlPoint2 = getCanvasPosition(controlPoint2.X, controlPoint2.Y);


	/* ----------------------------- DRAW THE GRADIENT FILL ----------------------------- */
	ctx.lineWidth = 4;
	const gradientFill = ctx.createLinearGradient(startPoint.X, startPoint.Y, endPoint.X, endPoint.Y);
	gradientFill.addColorStop(0, gradientColorStart);
	gradientFill.addColorStop(1, gradientColorEnd);

	ctx.fillStyle = gradientFill;
	ctx.beginPath();
	ctx.moveTo(startPoint.X, startPoint.Y);
	ctx.bezierCurveTo(
		controlPoint1.X, controlPoint1.Y,
		controlPoint2.X, controlPoint2.Y,
		endPoint.X, endPoint.Y
	);
	ctx.lineTo(endPoint.X, startPoint.Y);
	ctx.lineTo(startPoint.X, startPoint.Y);
	ctx.closePath();
	ctx.fill();

	
	/* ----------------------------- DRAW THE CURVE ----------------------------- */
	ctx.lineWidth = 4;
	const pointAtoBGradient = ctx.createLinearGradient(startPoint.X, startPoint.Y, endPoint.X, endPoint.Y);
	pointAtoBGradient.addColorStop(0, startPointColor);
	pointAtoBGradient.addColorStop(1, endPointColor);
	ctx.strokeStyle = pointAtoBGradient;
	ctx.beginPath();
	ctx.moveTo(startPoint.X, startPoint.Y);
	ctx.bezierCurveTo(
		controlPoint1.X, controlPoint1.Y,
		controlPoint2.X, controlPoint2.Y,
		endPoint.X, endPoint.Y
	);
	ctx.stroke();

	// draw lines from startPoint to control point 1 and endPoint to control point 2
	// startPoint to control point 1
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.strokeStyle = startPointColor;
	ctx.moveTo(startPoint.X, startPoint.Y);
	ctx.lineTo(controlPoint1.X, controlPoint1.Y);
	ctx.stroke();
	// endPoint to control point 2
	ctx.beginPath();
	ctx.strokeStyle = endPointColor;
	ctx.moveTo(endPoint.X, endPoint.Y);
	ctx.lineTo(controlPoint2.X, controlPoint2.Y);
	ctx.stroke();

	// fill in the points with arc 
	ctx.beginPath();
	ctx.fillStyle = startPointColor;
	ctx.arc(startPoint.X, startPoint.Y, 6, 0, Math.PI * 2);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = endPointColor;
	ctx.arc(endPoint.X, endPoint.Y, 5, 0, Math.PI * 2);
	ctx.fill();

	// fill in the control points with arc 
	// ctP1 and outline
	ctx.beginPath();
	ctx.fillStyle = startPointColor;
	ctx.arc(controlPoint1.X, controlPoint1.Y, 5, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = bezierCurveColors.grabControlPointColor_dark;
	ctx.arc(controlPoint1.X, controlPoint1.Y, 10, 0, Math.PI * 2);
	ctx.stroke();
	// ctP2 and outline
	ctx.beginPath();
	ctx.fillStyle = endPointColor;
	ctx.arc(controlPoint2.X, controlPoint2.Y, 5, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = bezierCurveColors.grabControlPointColor_dark;
	ctx.arc(controlPoint2.X, controlPoint2.Y, 10, 0, Math.PI * 2);
	ctx.stroke();
};


// const 