/* eslint-disable no-unused-vars */
import '../Styles/canvasBox.css';
import Canvas from './Canvas';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { PropTypes } from 'prop-types';
import { useRef, useState } from 'react';
// import { scssColors } from '../Helpers/env';



CanvasBox.propTypes = {
    bezierValues: PropTypes.object.isRequired,
    setBezierValue: PropTypes.func.isRequired,
    presetArray: PropTypes.array.isRequired,
    setPresetArray: PropTypes.func.isRequired
}

function CanvasBox({ bezierValues, setBezierValue, presetArray, setPresetArray }) {

    // state variables
    // button state variables
    const [snapToGrid, setSnapToGrid] = useState(false);
    // const [fitToScreen, setFitToScreen] = useState(null);
    const fitToScreenRef = useRef(null);
    const saveRef = useRef(null);
    const [isSaved, setIsSaved] = useState(false);
    const [saveTooltip, setSaveTooltip] = useState("Save");


    /* ------------------- Handle changes in the curve values ------------------- */
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


    /* -------------- handle save button click if not already saved ------------- */
    const createNewPreset = () => {
        const newPreset = {
            title: 'New Preset',
            bezierValue: bezierValues
        }
        
        setPresetArray(prevArray => [...prevArray, newPreset]);
    };
	const handleSaveClick = () => {
        if (!isSaved) {
            createNewPreset();
        }
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
					className={`btn grid-btn ${snapToGrid ? 'active' : ''}`}
					data-tooltip-id="tooltip" 
					data-tooltip-content="Snap to Grid"
                    role='button'
                    tabIndex={0}
                    onClick={() => setSnapToGrid(!snapToGrid)}
                >

                    <div 
                        className={`icon-btn grid-btn-icon ${snapToGrid ? 'active' : ''}`}
                    ></div>
				</div>

                <div 
					className="btn fit-btn" 
					data-tooltip-id="tooltip" 
					data-tooltip-content="Fit to Canvas"
                    role='button'
                    tabIndex={0}
                    onClick={() => {
                        if (fitToScreenRef.current) {
                            fitToScreenRef.current();
                        }
                    }}
                >

                    <div className="icon-btn fit-btn-icon"></div>
				</div>

                <div 
					className={`btn save-btn ${isSaved ? 'active' : ''}`}
					data-tooltip-id="tooltip" 
					data-tooltip-content={saveTooltip}
                    role='button'
                    tabIndex={0}
                    onClick={handleSaveClick}
                >

                    <div 
                        className={`icon-btn save-btn-icon ${isSaved ? 'active' : ''}`}
                    ></div>
				</div>

                <ReactTooltip 
                    id="tooltip" 
                    place="top" 
                    effect="solid" 
                    delayShow={150}
                    arrowColor="transparent"
                />

            </div>

            <Canvas 
                setBezierValues={setBezierValue} 
                snapToGrid={snapToGrid}
                fitToScreenRef={fitToScreenRef}
                saveRef={saveRef}
                setIsSaved={setIsSaved}
                setSaveTooltip={setSaveTooltip}
                presetArray={presetArray}
            />

        </div>
    );
}

export default CanvasBox;
