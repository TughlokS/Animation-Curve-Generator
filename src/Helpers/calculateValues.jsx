import { getCanvasPosition } from "./drawGrid";


/* ---------- // Gets the mouse position relative to the canvas \\ ---------- */
/**
 * @param {MouseEvent} e - The mouse event.
 * @param {React.RefObject} canvasRef - The reference to the canvas element.
 * @returns {Object} - The mouse position { x, y } relative to the canvas.
 */
export function getMousePositionOnCanvas(e, canvasRef) {    
    const isTouch = e.type.startsWith('touch');
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
    return { x, y };
}


/**
 * Determines if a control point is under the cursor.
 *
 * @param {number} mouseX - The x-coordinate of the mouse on the canvas.
 * @param {number} mouseY - The y-coordinate of the mouse on the canvas.
 * @param {Object} controlPoints - An object containing control points { cp1, cp2 }.
 * @param {Object} canvasParameters - Parameters including canvasSize, scale, offsetX, offsetY.
 * @param {number} hitRadius - The radius within which the control point is considered "hit".
 * @returns {string|null} - Returns 'cp1', 'cp2', or null if none is under the cursor.
 */
export function getControlPointUnderCursor(mouseX, mouseY, controlPoints, canvasParameters, hitRadius = 10) {
    const { cp1, cp2 } = controlPoints;
    const { canvasSize, scale, offsetX, offsetY, cellSize } = canvasParameters;

    const cp1CanvasPos = getCanvasPosition(cp1.X, cp1.Y, canvasSize, scale, offsetX, offsetY, cellSize);
    const cp2CanvasPos = getCanvasPosition(cp2.X, cp2.Y, canvasSize, scale, offsetX, offsetY, cellSize);

    const distanceToCP1 = getDistanceBetweenPoints(mouseX, mouseY, cp1CanvasPos.X, cp1CanvasPos.Y);
    if (distanceToCP1 <= hitRadius) {
        return 'cp1';
    }

    const distanceToCP2 = getDistanceBetweenPoints(mouseX, mouseY, cp2CanvasPos.X, cp2CanvasPos.Y);
    if (distanceToCP2 <= hitRadius) {
        return 'cp2';
    }

    return null;
}


/**
 * Calculates the Euclidean distance between two points.
 *
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} - The distance between the two points.
 */
export function getDistanceBetweenPoints(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}
