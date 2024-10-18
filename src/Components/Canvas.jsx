/* eslint-disable no-unused-vars */
import { drawGrid, getCanvasPosition, getGridPosition } from '../Helpers/drawGrid';
import { drawCurve } from '../Helpers/drawCurve';
import '../Styles/canvasBox.css'
import { useRef, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';




Canvas.propTypes = {
	setBezierValues: PropTypes.func.isRequired
}

function Canvas({ setBezierValues }) {

	/* ------------------- BEZIER VALUES CREATED BY THE CURVE ------------------- */
	// const [bezierValues, setBezierValues] = useState({
	// 	cp1: { X: 0, Y: 0 },
	// 	cp2: { X: 1, Y: 1 },
	// });
	/* ------------------- BEZIER VALUES CREATED BY THE CURVE ------------------- */

	/* ----------------------- variables for canvas setup ----------------------- */
	const canvasRef = useRef(null);

	// constants
	const cellSize = 40;
	const defaultScale = 0.75;
	const defaultOffset = { x: -5, y: -5 };

	// state variables
	const [canvasSize, setCanvasSize] = useState({ width: 661, height: 500 });
	const [offsetX, setOffsetX] = useState(defaultOffset.x);
	const [offsetY, setOffsetY] = useState(defaultOffset.y);
	const [scale, setScale] = useState(defaultScale);

	// state variables for dragging grid
	const [isDraggingGrid, setIsDraggingGrid] = useState(false);
	const [gridDragStart, setGridDragStart] = useState({ x: 0, y: 0 });

	// state variables for dragging controlPoints
	const [controlPoint1, setControlPoint1] = useState({ X: 0.25, Y: 0.1 });
	const [controlPoint2, setControlPoint2] = useState({ X: 0.25, Y: 1 });
	const [draggingControlPoint, setDraggingControlPoint] = useState(null); // null, 'cp1', or 'cp2'
	const [snapToGrid, setSnapToGrid] = useState(false);


	/* --------------------------- update canvas size --------------------------- */
	const updateCanvasSize = () => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			if (parent) {
				const { clientWidth, clientHeight } = canvas;
				setCanvasSize({ width: clientWidth, height: clientHeight });
			}
		}
	};
	// set canvas size on initial load
	useEffect(() => {
		updateCanvasSize();
	}, []);
	// set canvas size on window resize
	useEffect(() => {
		// updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);
	}, [canvasSize.width, canvasSize.height]);


	/* ------------ effect to draw the grid whenever offsets changes ------------ */
	useEffect(() => {
		// gets the current canvas dom element
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		canvas.width = canvasSize.width;
		canvas.height = canvasSize.height;

		// draw grid
		drawGrid(ctx, canvas.width, canvas.height, cellSize, offsetX, offsetY, scale);
		drawCurve(ctx, controlPoint1, controlPoint2);
	}, [canvasSize, offsetX, offsetY, scale, controlPoint1, controlPoint2]);


	/* -------------------------- MOUSE EVENT HANDLERS -------------------------- */
	// prevent the default behavior of the right mouse button
	const handleContextMenu = (e) => {
		e.preventDefault();
	}

	/* ----------------------- zoom in and out with mouse ----------------------- */
	const handleWheel = (e) => {
		if (e.deltaY < 0) {
			// limit zoom in to 1x size
			if (scale >= 1) return;
			// zoom in
			setScale((prevScale) => prevScale * 1.1);
		} else {
			// limit zoom out to 0.5x size
			if (scale <= 0.5) return;
			// zoom out
			setScale((prevScale) => prevScale / 1.1);
		}
	}
	
	/* ---------------- use mouse buttons to drag items in canvas --------------- */
	const handleMouseDown = (e) => {
		e.preventDefault();
		const { clientX, clientY } = e;
		// left mouse button held down initiates control point dragging
		if (e.button === 0) {
			const canvasRect = canvasRef.current.getBoundingClientRect();
			const canvasX = clientX - canvasRect.left;
			const canvasY = clientY - canvasRect.top;

			// Get canvas positions of control points
			const cp1CanvasPos = getCanvasPosition(controlPoint1.X, controlPoint1.Y);
			const cp2CanvasPos = getCanvasPosition(controlPoint2.X, controlPoint2.Y);

			// Check if the click is near control point 1
			const distanceToCP1 = Math.hypot(canvasX - cp1CanvasPos.X, canvasY - cp1CanvasPos.Y);
			// Check if the click is near control point 2
			const distanceToCP2 = Math.hypot(canvasX - cp2CanvasPos.X, canvasY - cp2CanvasPos.Y);

			const hitRadius = 10; // Same as the radius used when drawing the control points

			// if ()

			if (distanceToCP1 <= hitRadius) {
				setDraggingControlPoint('cp1');
			} else if (distanceToCP2 <= hitRadius) {
				setDraggingControlPoint('cp2');
			} else {
				// Not clicking on any control point
				setDraggingControlPoint(null);
			}
		}

		// right and middle mouse button held down initiates grid dragging
		else if (e.button === 1 || e.button === 2) {
			setIsDraggingGrid(true);
			setGridDragStart({ x: clientX, y: clientY });
		}
	};

	/* ---------------- if specific drag is true, drag that item ---------------- */
	const handleMouseMove = (e) => {
		e.preventDefault();
		// drag the grid
		if (isDraggingGrid) {
			const dx = e.clientX - gridDragStart.x;
			const dy = e.clientY - gridDragStart.y;

			let deltaX = offsetX + (dx / (cellSize * scale));
			let deltaY = offsetY - (dy / (cellSize * scale));

			// create out of bounds variables (out of bounds = Math.abs(offset) >= 14.5)
			const maxOffset = 10;
			const minOffset = -10;

			deltaX = Math.max(minOffset, Math.min(deltaX, maxOffset));
			deltaY = Math.max(minOffset, Math.min(deltaY, maxOffset));
			
			setOffsetX(deltaX) // since x is flipped, add deltaX instead;
			setOffsetY(deltaY);
			
			setGridDragStart({ x: e.clientX, y: e.clientY });
		}
		// drag the control points
		else if (draggingControlPoint) {
			// console.log(bezierValues.cp1.X);
			const canvasRect = canvasRef.current.getBoundingClientRect();
			const gridPos = getGridPosition(e.clientX, e.clientY, canvasRect);

			if (snapToGrid) {
				gridPos.x = Math.round(gridPos.x * 10) / 10;
				gridPos.y = Math.round(gridPos.y * 10) / 10;
			}

			if (draggingControlPoint === 'cp1') {
				setControlPoint1({ X: gridPos.x, Y: gridPos.y });
			} else if (draggingControlPoint === 'cp2') {
				setControlPoint2({ X: gridPos.x, Y: gridPos.y });
			}
		}
	};	

	// when right mouse and middle mouse button are released > stop dragging
	const handleMouseUp = (e) => {
		e.preventDefault();
		if (e.button === 0 || e.button === 1 || e.button === 2) {
			setIsDraggingGrid(false);
			setDraggingControlPoint(null);
		}
	};
	// when mouse leaves the canvas > stop dragging
	const handleMouseLeave = (e) => {
		e.preventDefault();
		if (isDraggingGrid) {
			setIsDraggingGrid(false);
		}
	};
	
	// handle ctrl press to reset zoom
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.ctrlKey) {
				setScale(defaultScale);
				setOffsetX(defaultOffset.x);
				setOffsetY(defaultOffset.y);
				setSnapToGrid(!snapToGrid);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});


	/* ---------------------- FINALLY SET THE BEZIER VALUES --------------------- */
	useEffect(() => {
		// rounds to 2 decimal places (0.00)
		const cp1X = Math.round(controlPoint1.X * 100) / 100;
		const cp1Y = Math.round(controlPoint1.Y * 100) / 100;
		const cp2X = Math.round(controlPoint2.X * 100) / 100;
		const cp2Y = Math.round(controlPoint2.Y * 100) / 100;
		setBezierValues({
			cp1: { X: cp1X, Y: cp1Y },
			cp2: { X: cp2X, Y: cp2Y }
		})
	}, [controlPoint1, controlPoint2, setBezierValues]);


	/* -------------------------------------------------------------------------- */
	/*                              RETURN STATEMENT                              */
	/* -------------------------------------------------------------------------- */
	return (
		<canvas 
			ref={canvasRef}
			className='curve-canvas'
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			// onMouseLeave={handleMouseLeave}
			onContextMenu={handleContextMenu}
			onWheel={handleWheel}
			style={ isDraggingGrid ? { cursor: 'grabbing' } : { cursor: 'default' }}
		></canvas>
	)
	/* -------------------------------------------------------------------------- */
	/*                              RETURN STATEMENT                              */
	/* -------------------------------------------------------------------------- */
}

export default Canvas;
