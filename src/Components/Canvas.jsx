/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { drawGrid, getCanvasPosition, getGridPosition } from '../Helpers/drawGrid';
import { drawCurve } from '../Helpers/drawCurve';
import {
    getMousePositionOnCanvas,
    getControlPointUnderCursor,
} from '../Helpers/calculateValues';

import '../Styles/canvasBox.css'
import { useRef, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';




Canvas.propTypes = {
	setBezierValues: PropTypes.func.isRequired,
	snapToGrid: PropTypes.bool.isRequired,
	snappingStepValue: PropTypes.number.isRequired,
	fitToScreenRef: PropTypes.object.isRequired,
	saveRef: PropTypes.object.isRequired,
	setIsSaved: PropTypes.func.isRequired,
	setSaveTooltip: PropTypes.func.isRequired,
	presetArray: PropTypes.array.isRequired
}

function Canvas({ 
	setBezierValues, 
	snapToGrid,
	snappingStepValue,
	fitToScreenRef, 
	saveRef, 
	setIsSaved,
	setSaveTooltip,
	presetArray
}) {

	/* ----------------------- variables for canvas setup ----------------------- */
	const canvasRef = useRef(null);

	// constants
	const cellSize = 40;
	const defaultScale = 0.75;
	const defaultOffset = { x: -5, y: -5 };
	const minMaxOffsetX = { min: -5, max: -5 };
	const minMaxOffsetY = { min: -19, max: 19 };
	const scrollSpeed = 2.5; // default 1 (1 = along with cursor)

	// state variables
	const [canvasSize, setCanvasSize] = useState({ width: 661, height: 500 });
	const [offsetX, setOffsetX] = useState(defaultOffset.x);
	const [offsetY, setOffsetY] = useState(defaultOffset.y);
	const [scale, setScale] = useState(defaultScale);

	// state variables for dragging grid
	const [isDraggingGrid, setIsDraggingGrid] = useState(false);
	const [gridDragStart, setGridDragStart] = useState({ x: 0, y: 0 });

	// state variables for dragging controlPoints
	const [controlPoint1, setControlPoint1] = useState({ X: 0, Y: 0 });
	const [controlPoint2, setControlPoint2] = useState({ X: 1, Y: 1 });
	const [draggingControlPoint, setDraggingControlPoint] = useState(null); // null, 'cp1', or 'cp2'
	const [lastDraggedControlPoint, setLastDraggedControlPoint] = useState(null); // null, 'cp1', or 'cp2'
	// const [snapToGrid, setSnapToGrid] = useState(false);


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



	/* -------------------------------------------------------------------------- */
	/*                            MOUSE EVENT HANDLERS                            */
	/* -------------------------------------------------------------------------- */
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



	/* ----------------- handle double click to open popupPrompt ---------------- */
	const [isControlPointEditorOpen, setControlPointEditorOpen] = useState(false);
	const [controlPointValueChanger, setControlPointValueChanger] = useState({ X: 0, Y: 0 });
	// opens the control point editor menu
	const handleDoubleClick = (e) => {
		e.preventDefault();

		if (lastDraggedControlPoint) {
			setControlPointEditorOpen(true);
		}
	}

	// handles showing the display value of the control point
	const displayControlPointValue = () => {
		const displayValues = {
			X: 0,
			Y: 0,
		};

		if (lastDraggedControlPoint) {
			if (lastDraggedControlPoint === 'cp1') {
				displayValues.X = controlPoint1.X.toFixed(2);
				displayValues.Y = controlPoint1.Y.toFixed(2);
			}
			else if (lastDraggedControlPoint === 'cp2') {
				displayValues.X = controlPoint2.X.toFixed(2);
				displayValues.Y = controlPoint2.Y.toFixed(2);
			}
		}

		return displayValues;
	}

	// handles relating control point when it is done manually through prompt menu
	const handleRelocatingControlPoint = () => {
		const xInput = document.getElementById('x-value');
		const yInput = document.getElementById('y-value');

		let xValue = xInput.value.trim();
		let yValue = yInput.value.trim();

		const currentValues = displayControlPointValue();

		// if both boxes are empty then close the editor
		if (xValue === '' && yValue === '') {
			setControlPointEditorOpen(false);
			return;
		}

		let x = xValue !== '' ? parseFloat(xValue) : parseFloat(currentValues.X);
		let y = yValue !== '' ? parseFloat(yValue) : parseFloat(currentValues.Y);

		if (isNaN(x)) x = parseFloat(currentValues.X);
		if (isNaN(y)) y = parseFloat(currentValues.Y);

		// make sure x is not greater than 1 or less than 0
		x = Math.max(0, Math.min(1, x));

		// round to 2 decimal places
		x = parseFloat(x.toFixed(2));
		y = parseFloat(y.toFixed(2));

		if (lastDraggedControlPoint === 'cp1') {
			setControlPoint1({ X: x, Y: y });
		}
		else if (lastDraggedControlPoint === 'cp2') {
			setControlPoint2({ X: x, Y: y });
		}

		setControlPointEditorOpen(false);
	}



	/* ---------------- use mouse buttons to drag items in canvas --------------- */
	const handleMouseDown = (e) => {
		e.preventDefault();

		const { clientX, clientY } = e;
		
		// left mouse button held down initiates grid dragging > store mouse pos
		if (e.button === 0) {
			// put all the parameters in a single object for ease of use
			const canvasParameters = {
				canvasSize,
				scale,
				offsetX,
				offsetY,
				cellSize,
			};

			// put control points in a single object for ease of use
			const controlPoints = {
				cp1: controlPoint1,
				cp2: controlPoint2,
			};

			// get mouse position on canvas
			const { x: mouseX, y: mouseY } = getMousePositionOnCanvas(e, canvasRef);

			const hitControlPoint = getControlPointUnderCursor(mouseX, mouseY, controlPoints, canvasParameters, 10);

			if (hitControlPoint) {
				setDraggingControlPoint(hitControlPoint);
				setLastDraggedControlPoint(hitControlPoint);
			} else {
				setDraggingControlPoint(null);

				// Click not near any control point
				if (lastDraggedControlPoint === 'cp1' || lastDraggedControlPoint === 'cp2') {
					
					const canvasRect = canvasRef.current.getBoundingClientRect();
					
					// Convert canvas coordinates to grid coordinates
					const gridPos = getGridPosition(clientX, clientY, canvasRect);

					if (snapToGrid) {
						gridPos.X = Math.round(gridPos.X / snappingStepValue) * snappingStepValue;
						gridPos.Y = Math.round(gridPos.Y / snappingStepValue) * snappingStepValue;
					}

					const clampedX = Math.max(0, Math.min(gridPos.X, 1));

					if (lastDraggedControlPoint === 'cp1') {
						setControlPoint1({ X: clampedX, Y: gridPos.Y });
					} else if (lastDraggedControlPoint === 'cp2') {
						setControlPoint2({ X: clampedX, Y: gridPos.Y });
					}
				}
			}

			// console.log('mouse down', lastDraggedControlPoint);
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
			//* enable for offset debugging
			// console.log(`offsetX: ${offsetX.toFixed(2)}} offsetY: ${offsetY.toFixed(2)}`);
			
			// const dx = e.clientX - gridDragStart.x; // don't need to pan on x axis
			const dy = (e.clientY - gridDragStart.y) * scrollSpeed;

			// let deltaX = offsetX + (dx / (cellSize * scale));
			let deltaY = offsetY - (dy / (cellSize * scale));

			// deltaX = Math.max(minMaxOffsetX.min, Math.min(deltaX, minMaxOffsetX.max)); // don't need to pan on x axis
			deltaY = Math.max(minMaxOffsetY.min, Math.min(deltaY, minMaxOffsetY.max));
			
			// setOffsetX(deltaX) // since x is flipped, add deltaX instead;
			setOffsetY(deltaY);
			setGridDragStart({ x: e.clientX, y: e.clientY });
		}
		// drag the control points
		else if (draggingControlPoint) {
			// console.log(bezierValues.cp1.X);
			const canvasRect = canvasRef.current.getBoundingClientRect();
			const gridPos = getGridPosition(e.clientX, e.clientY, canvasRect);

			if (snapToGrid) {
				gridPos.X = Math.round(gridPos.X / snappingStepValue) * snappingStepValue;
				gridPos.Y = Math.round(gridPos.Y / snappingStepValue) * snappingStepValue;
			}

			const clampedX = Math.max(0, Math.min(gridPos.X, 1));

			if (draggingControlPoint === 'cp1') {
				setControlPoint1({ X: clampedX, Y: gridPos.Y });
			} else if (draggingControlPoint === 'cp2') {
				setControlPoint2({ X: clampedX, Y: gridPos.Y });
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



	/* ----------------- handles the fit to screen button action ---------------- */
	useEffect(() => {
		if (!fitToScreenRef.current) {
			fitToScreenRef.current = () => {
				setScale(defaultScale);
				setOffsetX(defaultOffset.x);
				setOffsetY(defaultOffset.y);
				// console.log('fit to screen');
			};
		}
	}, [fitToScreenRef, defaultOffset]);



	/* ----------------- check if current curve is already saved ---------------- */
	const areBezierValuesEqual = (obj1, obj2, epsilon = 0.001) => {
		const isEqual = (a, b) => Math.abs(a - b) < epsilon;
	
		return (
			isEqual(obj1.cp1.X, obj2.cp1.X) &&
			isEqual(obj1.cp1.Y, obj2.cp1.Y) &&
			isEqual(obj1.cp2.X, obj2.cp2.X) &&
			isEqual(obj1.cp2.Y, obj2.cp2.Y)
		);
	};
	useEffect(() => {
		const cp1X = Math.round(controlPoint1.X * 100) / 100;
		const cp1Y = Math.round(controlPoint1.Y * 100) / 100;
		const cp2X = Math.round(controlPoint2.X * 100) / 100;
		const cp2Y = Math.round(controlPoint2.Y * 100) / 100;

		const bezierValues = {
			cp1: { X: cp1X, Y: cp1Y },
			cp2: { X: cp2X, Y: cp2Y }
		};

		const savedPreset = presetArray.find(obj => areBezierValuesEqual(obj.bezierValue, bezierValues));

		setIsSaved(savedPreset);
		setSaveTooltip(savedPreset ? savedPreset.title : "Save");

		// if (saveRef.current) {
		// 	saveRef.current();
		// }
	}, [controlPoint1, controlPoint2, presetArray, setIsSaved]);



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

		<>
			<canvas 
				ref={canvasRef}
				className='curve-canvas'
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				// onMouseLeave={handleMouseLeave}
				onDoubleClick={handleDoubleClick}
				onContextMenu={handleContextMenu}
				onWheel={handleWheel}
				style={ isDraggingGrid ? { cursor: 'grabbing' } : { cursor: 'default' }}
			></canvas>


			{
				isControlPointEditorOpen && (
					<>
						<div 
							className="control-values-overlay"
							onClick={() => setControlPointEditorOpen(false)}
						></div>
						<div 
							className="control-values-content"
							role='dialog'
							aria-modal='true'
							aria-labelledby='control-values-title'
						>

							<div 
								className={`control-values-body ${lastDraggedControlPoint === 'cp1' ? 'cp1' : lastDraggedControlPoint === 'cp2' ? 'cp2' : ''}`}
							>

								{/* <label htmlFor="x-value">X</label> */}
								<input 
									id="x-value"
									className='x-value first-box'
									placeholder={`X: ${displayControlPointValue().X}`}
									onChange={(e) => setControlPointValueChanger((prev) => ({ ...prev, X: e.target.value }))}
									type="text"
								/>

								{/* <label htmlFor="y-value">Y</label> */}
								<input 
									id="y-value"
									className='y-value'
									placeholder={`Y: ${displayControlPointValue().Y}`}
									onChange={(e) => setControlPointValueChanger((prev) => ({ ...prev, Y: e.target.value }))}
									type="text"
								/>

							</div>

							<div className="footer">
								<button
									className={`submit-button ${lastDraggedControlPoint === 'cp1' ? 'cp1' : lastDraggedControlPoint === 'cp2' ? 'cp2' : ''}`}
									onClick={handleRelocatingControlPoint}
								>Ok</button>
							</div>

						</div>
					</>
				)
			}
		
		</>

	)
	/* -------------------------------------------------------------------------- */
	/*                              RETURN STATEMENT                              */
	/* -------------------------------------------------------------------------- */
}

export default Canvas;
