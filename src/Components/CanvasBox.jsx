import { useState } from 'react';
import '../Styles/canvasBox.css';
import Canvas from './Canvas';
import { Tooltip as ReactTooltip } from 'react-tooltip';



function CanvasBox() {

    const [curveValues, setCurveValues] = useState({
        'curve-value1': 0,
        'curve-value2': 0,
        'curve-value3': 1,
        'curve-value4': 1
    });

    const handleCurveValueChange = (id, newValue) => {
        setCurveValues(prevValues => ({
            ...prevValues,
            [id]: parseFloat(newValue) || 0
        }));
    };

    return (
        <div className='canvas-box'>

            <div className="canvas-buttons">

                <div className="curve-value-box">
                    {Object.keys(curveValues).map((key) => (
                        <input 
                        key={key}
                        className="curve-values" 
                        id={key} 
                        type="number" 
                        min={-9} 
                        max={9}
                        step={0.05} 
                        value={curveValues[key]}
                        onChange={(e) => handleCurveValueChange(key, e.target.value)}
                        aria-label={`Curve Value ${key.slice(-1)}`}
                        />
                    ))}
                </div>

                <div 
					className="btn grid-btn" 
					data-tooltip-id="tooltip" 
					data-tooltip-content="Snap to Grid">	
				</div>

                <div 
					className="btn fit-btn" 
					data-tooltip-id="tooltip" 
					data-tooltip-content="Fit to Canvas">
				</div>

                <div 
					className="btn save-btn" 
					data-tooltip-id="tooltip" 
					data-tooltip-content="Save">
				</div>

                <ReactTooltip 
                    id="tooltip" 
                    place="top" 
                    effect="solid" 
                    delayShow={150}
                    arrowColor="transparent"
                />

            </div>

            <Canvas />

        </div>
    );
}

export default CanvasBox;
