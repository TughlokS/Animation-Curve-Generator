// import { gridLineColor, gridWideBoxColor, gridAxisColor } from '../Styles/canvasGroup.scss';
import { gridColors } from './env';



let globalOffsetX = 0;
let globalOffsetY = 0;
let width = 0;
let height = 0;
let globalCellSize = 0;
let globalScale = 1;


/* -------------------------------------------------------------------------- */
/*                           MAIN FUNCTION TO EXPORT                          */
/* -------------------------------------------------------------------------- */
export function drawGrid(ctx, canvasWidth, canvasHeight, cellSize, offsetX = 0, offsetY = 0, scale = 1) {
	// set global variables
	globalOffsetY = offsetY;
	width = canvasWidth;
	height = canvasHeight;
	globalCellSize = cellSize;
	globalScale = scale;
	
	
	// const gridLineColor = `rgba(67, 69, 74, ${scale / 2})`; // opacity same as scale
	const gridLineColor = gridColors.gridLineColor_dark;
	const gridWideBoxColor = gridColors.gridWideBoxColor_dark;
	const gridAxisColor = gridColors.gridAxisColor_dark;
	// adjust offset to match tradition graph axis coordinates 
	offsetX = offsetX === 0 ? 0 : offsetX * -1; // -x went right previously now goes left
	globalOffsetX = offsetX;
	// clear the entire canvas before drawing to not keep previous drawings
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	// save the current context state
	ctx.save();
	// set a consistent line width
	ctx.lineWidth = 1 / scale;
	
	// translate the context to center the grid and apply offsets
	ctx.translate(canvasWidth / 2, canvasHeight / 2); // centers grid
	// apply scaling
	ctx.scale(scale, scale);
	// apply offsets
	ctx.translate(-offsetX * cellSize, -offsetY * cellSize);


	/* -------------------- draw grid lines for x and y axis -------------------- */
	// calculate half width and height in grid coordinates
	const halfWidth = (canvasWidth / 2) / scale;
	const halfHeight = (canvasHeight / 2) / scale;

	// determine the range for grid lines
	let drawDistance = 10; // increase or decrease drawDistance to increase or decrease grid render distance
	drawDistance += Math.abs(Math.max(Math.abs(offsetX), Math.abs(offsetY)));
	const startX = -halfWidth - (cellSize * drawDistance);
	const endX = halfWidth + (cellSize * drawDistance);
	const startY = -halfHeight - (cellSize * drawDistance);
	const endY = halfHeight + (cellSize * drawDistance);
	
	// draw the grid lines
	ctx.strokeStyle = gridLineColor;
	ctx.beginPath();
	// vertical (add some extra length to the lines to account for panning)
	for (let x = Math.floor(startX / cellSize) * cellSize; x <= endX; x += cellSize) {
		ctx.moveTo(x, startY);
		ctx.lineTo(x, endY);
	}
	// horizontal
	for (let y = Math.floor(startY / cellSize) * cellSize; y <= endY; y += cellSize) {
		ctx.moveTo(startX, y);
		ctx.lineTo(endX, y);
	}
	ctx.stroke();


	/* ---------- Use gridWideBoxColor every 10 lines both x and y axis --------- */
	ctx.strokeStyle = gridWideBoxColor;
	ctx.beginPath();

	// vertical (only every 10 lines)
	for (let x = Math.floor(startX / (cellSize * 10)) * cellSize * 10; x <= endX; x += cellSize * 10) {
		ctx.moveTo(x, startY);
		ctx.lineTo(x, endY);
	}
	// horizontal (only every 10 lines)
	for (let y = Math.floor(startY / (cellSize * 10)) * cellSize * 10; y <= endY; y += cellSize * 10) {
		ctx.moveTo(startX, y);
		ctx.lineTo(endX, y);
	}
	ctx.stroke();


	/* -------------------------- draw grid axis lines -------------------------- */
	// draw axis lines
	ctx.strokeStyle = gridAxisColor;
	ctx.beginPath();
	
	// vertical axis line
	ctx.moveTo(0, startY);
	ctx.lineTo(0, endY);

	// horizontal axis line
	ctx.moveTo(startX, 0);
	ctx.lineTo(endX, 0);
	
	ctx.stroke();

	// restore the context state
	ctx.restore();
};
/* -------------------------------------------------------------------------- */
/*                           MAIN FUNCTION TO EXPORT                          */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*               CONVERTS X, Y COORDINATES INTO CANVAS POSITIONS              */
/* -------------------------------------------------------------------------- */
/* -------------- x, y coordinates into direct canvas positions ------------- */
export const getCanvasPosition = (x, y) => {
	x *= -10;
	y *= 10;

    // calculate canvasX and canvasY based on the transformations
    const canvasX = -(x + globalOffsetX) * globalCellSize * globalScale + width / 2;
    const canvasY = -(y + globalOffsetY) * globalCellSize * globalScale + height / 2;
    
    return { X: canvasX, Y: canvasY };
};


/* ------------------ client position into grid coordinates ----------------- */
export const getGridPosition = (x, y, canvasRect) => {
	// calculate the mouse pos relative to the canvas
	const canvasX = x - canvasRect.left;
	const canvasY = y - canvasRect.top;

	const gridX = -(canvasX - width / 2) / (globalCellSize * globalScale) - globalOffsetX;
	const gridY = -(canvasY - height / 2) / (globalCellSize * globalScale) - globalOffsetY;

	return { x: -gridX / 10, y: gridY / 10};
}
/* -------------------------------------------------------------------------- */
/*               CONVERTS X, Y COORDINATES INTO CANVAS POSITIONS              */
/* -------------------------------------------------------------------------- */
