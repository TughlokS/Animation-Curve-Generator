import '../Styles/canvasBox.css';
import Canvas from './Canvas';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { PropTypes } from 'prop-types';



CanvasBox.propTypes = {
    bezierValues: PropTypes.object.isRequired,
    setBezierValue: PropTypes.func.isRequired
}

function CanvasBox({ bezierValues, setBezierValue }) {

    // Handle changes in the curve values
    const handleCurveValueChange = (controlPoint, axis, value) => {
        // Update the bezier values using the setBezierValue prop
        const updatedValue = parseFloat(value);
        setBezierValue(prevValues => ({
            ...prevValues,
            [controlPoint]: {
                ...prevValues[controlPoint],
                [axis]: updatedValue
            }
        }));
    };


    return (
        <div className='canvas-box'>

            <div className="canvas-buttons">

                <div className="curve-value-box">
                    {/* Inputs for cp1.X, cp1.Y, cp2.X, and cp2.Y */}
                    <input
                        className="curve-values"
                        id="cp1X"
                        type="number"
                        min={-9}
                        max={9}
                        step={0.05}
                        value={bezierValues.cp1.X}
                        onChange={(e) => handleCurveValueChange('cp1', 'X', e.target.value)}
                        aria-label="Curve Value cp1X"
                    />
                    <input
                        className="curve-values"
                        id="cp1Y"
                        type="number"
                        min={-9}
                        max={9}
                        step={0.05}
                        value={bezierValues.cp1.Y}
                        onChange={(e) => handleCurveValueChange('cp1', 'Y', e.target.value)}
                        aria-label="Curve Value cp1Y"
                    />
                    <input
                        className="curve-values"
                        id="cp2X"
                        type="number"
                        min={-9}
                        max={9}
                        step={0.05}
                        value={bezierValues.cp2.X}
                        onChange={(e) => handleCurveValueChange('cp2', 'X', e.target.value)}
                        aria-label="Curve Value cp2X"
                    />
                    <input
                        className="curve-values"
                        id="cp2Y"
                        type="number"
                        min={-9}
                        max={9}
                        step={0.05}
                        value={bezierValues.cp2.Y}
                        onChange={(e) => handleCurveValueChange('cp2', 'Y', e.target.value)}
                        aria-label="Curve Value cp2Y"
                    />
                </div>

                <div 
					className="btn grid-btn" 
					data-tooltip-id="tooltip" 
					data-tooltip-content="Snap to Grid">

                    <div className="icon-btn grid-btn-icon"></div>
				</div>

                <div 
					className="btn fit-btn" 
					data-tooltip-id="tooltip" 
					data-tooltip-content="Fit to Canvas">

                    <div className="icon-btn fit-btn-icon"></div>
				</div>

                <div 
					className="btn save-btn" 
					data-tooltip-id="tooltip" 
					data-tooltip-content="Save">

                    <div className="icon-btn save-btn-icon"></div>
				</div>

                <ReactTooltip 
                    id="tooltip" 
                    place="top" 
                    effect="solid" 
                    delayShow={150}
                    arrowColor="transparent"
                />

            </div>

            <Canvas setBezierValues={setBezierValue} />

        </div>
    );
}

export default CanvasBox;
