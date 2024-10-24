/* eslint-disable no-unused-vars */
import '../Styles/canvasBox.css';
import '../Styles/popupPrompt.css';
import Canvas from './Canvas';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { PropTypes } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { areBezierValuesEqual } from '../Helpers/compareValues';
// import { scssColors } from '../Helpers/env';



CanvasBox.propTypes = {
    bezierValues: PropTypes.object.isRequired,
    setBezierValue: PropTypes.func.isRequired,
    presetArray: PropTypes.array.isRequired,
    setPresetArray: PropTypes.func.isRequired
}

function CanvasBox({ bezierValues, setBezierValue, presetArray, setPresetArray }) {

    // constants
    const snappingSteps = [0.5, 0.25, 0.1, 0.05, 0.025, 0.01];
    const defaultSnapStepIndex = snappingSteps.indexOf(0.1);


    /* ----------------------------- state variables ---------------------------- */
    // snap grid state variable
    const [snapToGrid, setSnapToGrid] = useState(false);

    // fit to screen state variables
    const fitToScreenRef = useRef(null);

    // save state variables
    const saveRef = useRef(null);
    const matchingPreset = presetArray.find((preset) => areBezierValuesEqual(preset.bezierValue, bezierValues));
    const [isSavedPromptOpen, setIsSavePromptOpen] = useState(false);
    const [isUnsavePromptOpen, setIsUnsavePromptOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saveTooltip, setSaveTooltip] = useState("Save");
    const [presetTitle, setPresetTitle] = useState('');

    // settings state variables
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [stepIndex, setStepIndex] = useState(defaultSnapStepIndex);


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
    const handleSaveClick = () => {
        if (!isSaved) {
            setIsSavePromptOpen(true);
            setIsUnsavePromptOpen(false);
        } else {
            if (matchingPreset && matchingPreset.isLocked) return;
            
            setIsSavePromptOpen(false);
            setIsUnsavePromptOpen(true);
        }
    };
    const handleUnsavingPreset = () => {

        setPresetArray((prevArray) => {
            return prevArray.filter((preset) => {
                // Keep presets that do NOT match the current bezierValues
                return !areBezierValuesEqual(preset.bezierValue, bezierValues);
            });
        });

        setIsUnsavePromptOpen(false);
    };    
	const handleSavingPreset = () => {
        const title = presetTitle.trim() || 'New Preset';

        if (!isSaved) {
            const newPreset = {
                id: uuidv4(),
                title: title,
                bezierValue: bezierValues,
                isFavorite: false,
                isLocked: false
            };

            setPresetArray(prevArray => [...prevArray, newPreset]);
        }

        setPresetTitle('');
        setIsSavePromptOpen(false);
	};
    const handleSavedModalClick = (e) => {
        if (e.target.classList.contains('saved-modal-overlay')) {
            setIsSavePromptOpen(false);
        }
    };
    const handleUnsaveModalClick = (e) => {
        if (e.target.classList.contains('unsaved-modal-overlay')) {
            setIsUnsavePromptOpen(false);
        }
    };


    /* -------------------- handle settings button and modal -------------------- */
    const handleStepChange = (e) => {
        const index = parseInt(e.target.value, 10);
        setStepIndex(index);
        // You can add additional logic here if needed
    };
    
    const handleSettingsModalClick = (e) => {
        if (e.target.classList.contains('settings-modal-overlay')) {
            setIsSettingsOpen(false);
        }
    };


    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setIsSettingsOpen(false);
                setIsSavePromptOpen(false);
                setIsUnsavePromptOpen(false);
            }
        };
        if (isSettingsOpen || isSavedPromptOpen || isUnsavePromptOpen) {
            window.addEventListener('keydown', handleEsc);
        } else {
            window.removeEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isSettingsOpen, isSavedPromptOpen, isUnsavePromptOpen]);



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

                    <div 
                        className={`btn setting-btn ${isSettingsOpen ? 'active' : ''}`}
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Snap settings"
                        role='button'
                        tabIndex={0}
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >

                        <div 
                            className={`icon-btn setting-btn-icon ${isSettingsOpen ? 'active' : ''}`}
                        ></div>
                    </div>

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
					data-tooltip-content="Default zoom and center"
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
                snappingStepValue={snappingSteps[stepIndex]}
                fitToScreenRef={fitToScreenRef}
                saveRef={saveRef}
                setIsSaved={setIsSaved}
                setSaveTooltip={setSaveTooltip}
                presetArray={presetArray}
            />



            {/* POPUP MODALS */}

            {/* Modal for Settings */}
            {
                isSettingsOpen && (
                <>
                    <div className="settings-modal-overlay" onClick={handleSettingsModalClick}></div>
                    <div className="settings-modal-content" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title" >
                        <div className="settings-modal-body">
                            <div 
                                className="slider-container"
                                data-tooltip-id="modal-tooltip" 
                                data-tooltip-content="Grid snapping steps"
                            >
                                <input 
                                    type="range"
                                    id="snapStep"
                                    min="0"
                                    max={snappingSteps.length - 1}
                                    step="1"
                                    value={stepIndex}
                                    onChange={handleStepChange}
                                    className={`custom-slider ${snappingSteps[stepIndex] === snappingSteps[defaultSnapStepIndex] ? 'default-step' : ''}`}
                                    aria-label="Snapping Steps Slider"
                                />
                                <div className="slider-labels">
                                    <div className={`slider-label`}>
                                        {snappingSteps[stepIndex]}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsSettingsOpen(false)}
                                className="close-button"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Save */}
            {
                isSavedPromptOpen && (
                <>
                    <div 
                        className="saved-modal-overlay"
                        onClick={handleSavedModalClick}
                    ></div>
                    <div 
                        className="saved-modal-content"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="saved-modal-title"
                    >
                        <div className="saved-modal-body">
                            <div 
                                className="text-input-container"
                                data-tooltip-id="modal-tooltip"
                                data-tooltip-content="Enter a name for your preset"
                            >
                                <label htmlFor="preset-name">Title</label>
                                <input 
                                    type="text"
                                    id="preset-name"
                                    placeholder="New Preset"
                                    className="title-input"
                                    aria-label='Preset name'
                                    onChange={(e) => setPresetTitle(e.target.value)}
                                />
                            </div>

                            <button
                                className="save-button"
                                onClick={handleSavingPreset}
                            >Save</button>
                        </div>
                    </div>
                </>
                )
            }

            {/* Modal for un-saving */}
            {
                isUnsavePromptOpen && (
                    <>
                        <div 
                            className="unsave-modal-overlay"
                            onClick={handleUnsaveModalClick}
                        ></div>
                        <div 
                            className="unsave-modal-content"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="unsave-modal-title"
                        >
                            <div className="unsave-modal-body">
                                <label htmlFor="unsave-prompt">
                                    Delete this preset?
                                </label>
                                <div className="buttons">
                                    <button
                                        className="unsave-button"
                                        onClick={() => setIsUnsavePromptOpen(false)}
                                    >
                                        No
                                    </button>

                                    <button
                                        className="cancel-button"
                                        onClick={handleUnsavingPreset}
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

            <ReactTooltip 
                id="modal-tooltip" 
                place="top" 
                effect="solid" 
                delayShow={100}
                arrowColor="transparent"
            />

        </div>
    );
}

export default CanvasBox;
