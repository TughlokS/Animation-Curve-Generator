/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { drawGrid, getCanvasPosition, getGridPosition } from '../Helpers/drawGrid';
import { drawCurve } from '../Helpers/drawCurve';
import {
    getMousePositionOnCanvas,
    getControlPointUnderCursor,
} from '../Helpers/calculateValues';
import { areBezierValuesEqual } from '../Helpers/compareValues';

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
	
	// constants
	const cellSize = 40;
	const defaultScale = 0.75;
	const defaultOffset = { x: -5, y: -5 };
	const minMaxOffsetX = { min: -5, max: -5 };
	const minMaxOffsetY = { min: -19, max: 19 };
	const scrollSpeed = 2.5; // default 1 (1 = along with cursor)
	
	// Flag to track if touch events have been initialized
	const touchEventsInitialized = useRef(false);
	
	// references
	const canvasRef = useRef(null);
	const containerRef = useRef(null);

	// state variables
	// Initialize with responsive dimensions that will be updated by ResizeObserver
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


	// Direct window resize handler for canvas responsiveness
	useEffect(() => {
		// Function to calculate and set canvas size based on window size
		const updateCanvasSize = () => {
			// Get the parent container width (canvas-box)
			const canvasBox = document.querySelector('.canvas-box');
			if (!canvasBox) return;
			
			// Calculate available width (accounting for padding)
			const boxStyle = window.getComputedStyle(canvasBox);
			const paddingLeft = parseFloat(boxStyle.paddingLeft);
			const paddingRight = parseFloat(boxStyle.paddingRight);
			
			// Get the total canvas box width and available width
			const boxWidth = canvasBox.clientWidth;
			const availableWidth = boxWidth - paddingLeft - paddingRight;
			
			if (availableWidth <= 0) return;
			
			// Calculate the desired padding percentage (consistent gap around canvas)
			// We want the canvas to take up most of the space but leave a consistent gap
			const desiredPaddingPercent = 0.05; // 5% padding on each side
			const targetPadding = boxWidth * desiredPaddingPercent;
			
			// Calculate the target width based on the desired padding
			const targetWidth = boxWidth - (targetPadding * 2);
			
			// Set aspect ratio based on screen size
			let aspectRatio = 661 / 500; // Default aspect ratio
			
			// Adjust aspect ratio based on screen width
			if (window.innerWidth <= 480) {
				aspectRatio = 1; // 1:1 for mobile
			} else if (window.innerWidth <= 768) {
				aspectRatio = 4 / 3; // 4:3 for tablets
			}
			
			// Calculate height based on width and aspect ratio
			const height = targetWidth / aspectRatio;
			
			console.log('Canvas size updated:', { 
				width: targetWidth, 
				height, 
				boxWidth, 
				availableWidth, 
				padding: targetPadding
			});
			
			// Set canvas size state
			setCanvasSize({ width: targetWidth, height });
		};

		// Initial size calculation
		updateCanvasSize();
		
		// Update on window resize
		window.addEventListener('resize', updateCanvasSize);
		
		// Also update when the component mounts and after a short delay
		// This helps with initial rendering issues
		const timeoutId = setTimeout(updateCanvasSize, 100);
		
		return () => {
			window.removeEventListener('resize', updateCanvasSize);
			clearTimeout(timeoutId);
		};
	}, []);


	// Update canvas element dimensions based on container size
	useEffect(() => {
		if (canvasRef.current && canvasSize.width && canvasSize.height) {
			const canvas = canvasRef.current;
			// Use devicePixelRatio for crisp rendering on high DPI screens
			const dpr = window.devicePixelRatio || 1;
			
			console.log('Applying canvas size:', canvasSize);
			
			// Set canvas dimensions with device pixel ratio for sharp rendering
			canvas.width = canvasSize.width * dpr;
			canvas.height = canvasSize.height * dpr;
			
			// Set display size (CSS) - force the canvas to take these exact dimensions
			canvas.style.width = `${canvasSize.width}px`;
			canvas.style.height = `${canvasSize.height}px`;
			
			// Get context and scale it
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.scale(dpr, dpr);
			
			// Calculate adjusted cell size based on canvas width
			// This ensures the grid scales properly with the canvas size
			const originalWidth = 661;
			const widthRatio = canvasSize.width / originalWidth;
			const adjustedCellSize = cellSize * (widthRatio > 1 ? 1 : widthRatio);
			
			// Redraw the grid and curve on resize with adjusted cell size
			drawGrid(ctx, canvasSize.width, canvasSize.height, adjustedCellSize, offsetX, offsetY, scale);
			drawCurve(ctx, controlPoint1, controlPoint2);
		}
	}, [canvasSize, offsetX, offsetY, scale, controlPoint1, controlPoint2]);


	// /* --------------------------- update canvas size --------------------------- */
	// const updateCanvasSize = () => {
	// 	if (canvasRef.current) {
	// 		const canvas = canvasRef.current;
	// 		if (parent) {
	// 			const { clientWidth, clientHeight } = canvas;
	// 			setCanvasSize({ width: clientWidth, height: clientHeight });
	// 		}
	// 	}
	// };
	// // set canvas size on initial load
	// useEffect(() => {
	// 	updateCanvasSize();
	// }, []);
	// // set canvas size on window resize
	// useEffect(() => {
	// 	// updateCanvasSize();
	// 	window.addEventListener('resize', updateCanvasSize);
	// }, [canvasSize.width, canvasSize.height]);


	// /* ------------ effect to draw the grid whenever offsets changes ------------ */
	// useEffect(() => {
	// 	// gets the current canvas dom element
	// 	const canvas = canvasRef.current;
	// 	const ctx = canvas.getContext('2d');

	// 	canvas.width = canvasSize.width;
	// 	canvas.height = canvasSize.height;

	// 	// draw grid
	// 	drawGrid(ctx, canvas.width, canvas.height, cellSize, offsetX, offsetY, scale);
	// 	drawCurve(ctx, controlPoint1, controlPoint2);
	// }, [canvasSize, offsetX, offsetY, scale, controlPoint1, controlPoint2]);


	/* -------------------------------------------------------------------------- */
	/*                            MOUSE EVENT HANDLERS                            */
	/* -------------------------------------------------------------------------- */
	// prevent the default behavior of the right mouse button
	const handleContextMenu = (e) => {
		e.preventDefault();
	}

	/* ----------------------- zoom in and out with mouse ----------------------- */
	// This function is just for React's synthetic event system
	// The actual preventDefault is handled by the wheel event listener added in useEffect
	const handleWheel = (e) => {
		// Don't call preventDefault here - it will cause errors with passive listeners
		
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

	useEffect(() => {
		const canvas = canvasRef.current;
		const handleWheelEvent = (e) => {
			e.preventDefault();
		};
		canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
		return () => {
			canvas.removeEventListener('wheel', handleWheelEvent);
		};
	}, [canvasRef]);



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
	
	// Set up touch event listeners with { passive: false } to allow preventDefault()
	useEffect(() => {
		if (!canvasRef.current || touchEventsInitialized.current) return;
		
		const canvas = canvasRef.current;
		
		// Add non-passive touch event listeners
		canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
		canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
		canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
		
		// Add non-passive wheel event listener to prevent page scrolling when zooming
		// This is the proper way to prevent scrolling - using a non-passive event listener
		const wheelHandler = (e) => {
			e.preventDefault();
		};
		canvas.addEventListener('wheel', wheelHandler, { passive: false });
		
		touchEventsInitialized.current = true;
		
		// Clean up event listeners on unmount
		return () => {
			canvas.removeEventListener('touchstart', handleTouchStart);
			canvas.removeEventListener('touchmove', handleTouchMove);
			canvas.removeEventListener('touchend', handleTouchEnd);
			canvas.removeEventListener('wheel', wheelHandler);
		};
	}, [canvasRef.current]); // Only re-run if canvasRef changes



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
	
	// Touch event handlers
	const handleTouchStart = (e) => {
		// Note: preventDefault() is handled via the non-passive event listener setup
		
		if (e.touches.length === 1) {
			const touch = e.touches[0];
			const touchEvent = {
				clientX: touch.clientX,
				clientY: touch.clientY,
				button: 0, // Simulate left mouse button
				preventDefault: () => {}
			};
			
			// Use the same logic as mouse down
			handleMouseDown(touchEvent);
		} else if (e.touches.length === 2) {
			// Two finger touch could be used for panning (similar to right-click drag)
			const touch = e.touches[0];
			const touchEvent = {
				clientX: touch.clientX,
				clientY: touch.clientY,
				button: 2, // Simulate right mouse button for panning
				preventDefault: () => {}
			};
			
			handleMouseDown(touchEvent);
		}
		return false; // Prevent default behavior
	};
	
	const handleTouchMove = (e) => {
		// Note: preventDefault() is handled via the non-passive event listener setup
		
		if (e.touches.length >= 1) {
			const touch = e.touches[0];
			const touchEvent = {
				clientX: touch.clientX,
				clientY: touch.clientY,
				preventDefault: () => {}
			};
			
			// Use the same logic as mouse move
			handleMouseMove(touchEvent);
		}
		return false; // Prevent default behavior
	};
	
	const handleTouchEnd = (e) => {
		// Note: preventDefault() is handled via the non-passive event listener setup
		
		const touchEvent = {
			button: 0, // Simulate left mouse button release
			preventDefault: () => {}
		};
		
		// Use the same logic as mouse up
		handleMouseUp(touchEvent);
		return false; // Prevent default behavior
	};
	
	return (

		<>
			<div className='canvas-container' style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
					style={{ 
						width: `${canvasSize.width}px`, 
						height: `${canvasSize.height}px`,
						cursor: isDraggingGrid ? 'grabbing' : 'default',
						touchAction: 'none' // Disable browser's default touch actions
					}}
				>
				</canvas>
			</div>


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
