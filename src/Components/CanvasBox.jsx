/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Canvas from './Canvas';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

import '../Styles/canvasBox.css';
import '../Styles/popupPrompt.css';

import { areBezierValuesEqual } from '../Helpers/compareValues';
import { bezierValuesBoxReadOnly, defaultGridSnappingStep } from '../Helpers/env';


// Constants for snapping steps
const snappingSteps = [0.5, 0.25, 0.1, 0.05, 0.025, 0.01];
const defaultSnapStepIndex = snappingSteps.indexOf(defaultGridSnappingStep);


/* -------------------------------------------------------------------------- */
/*                               SUB COMPONENTS                               */
/* -------------------------------------------------------------------------- */
// Renders the four curve value input fields.
function CurveInputs({ bezierValues, onChange }) {
	CurveInputs.propTypes = {
		bezierValues: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	};

	const inputConfigs = [
		{ id: "cp1X", controlPoint: "cp1", axis: "X", value: bezierValues.cp1.X, label: "Curve Value cp1X" },
		{ id: "cp1Y", controlPoint: "cp1", axis: "Y", value: bezierValues.cp1.Y, label: "Curve Value cp1Y" },
		{ id: "cp2X", controlPoint: "cp2", axis: "X", value: bezierValues.cp2.X, label: "Curve Value cp2X" },
		{ id: "cp2Y", controlPoint: "cp2", axis: "Y", value: bezierValues.cp2.Y, label: "Curve Value cp2Y" },
	];

    
	return (
		<>
			{inputConfigs.map(({ id, controlPoint, axis, value, label }) => (
				<input
					key={id}
					className="curve-values"
					id={id}
					type="number"
					min={-9}
					max={9}
					step={0.05}
					readOnly={bezierValuesBoxReadOnly}
					value={value}
					onChange={(e) => onChange(controlPoint, axis, e.target.value)}
					aria-label={label}
				/>
			))}
		</>
	);
}

// Settings modal for adjusting snapping steps.
function SettingsModal({ isOpen, snappingSteps, defaultSnapStepIndex, stepIndex, onStepChange, onClose }) {
	SettingsModal.propTypes = {
		isOpen: PropTypes.bool.isRequired,
		snappingSteps: PropTypes.array.isRequired,
		defaultSnapStepIndex: PropTypes.number.isRequired,
		stepIndex: PropTypes.number.isRequired,
		onStepChange: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	const handleOverlayClick = (e) => {
		if (e.target.classList.contains('settings-modal-overlay')) {
			onClose();
		}
	};

	if (!isOpen) return null;
	return (
		<>
			<div className="settings-modal-overlay" onClick={handleOverlayClick}></div>
			<div className="settings-modal-content" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
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
							onChange={onStepChange}
							className={`custom-slider ${snappingSteps[stepIndex] === snappingSteps[defaultSnapStepIndex] ? 'default-step' : ''
								}`}
							aria-label="Snapping Steps Slider"
						/>
						<div className="slider-labels">
							<div className="slider-label">{snappingSteps[stepIndex]}</div>
						</div>
					</div>
					<button onClick={onClose} className="close-button">
						Done
					</button>
				</div>
			</div>
		</>
	);
}

// Save modal for adding a new preset.
function SaveModal({ isOpen, presetTitle, setPresetTitle, onSave, onClose }) {
	SaveModal.propTypes = {
		isOpen: PropTypes.bool.isRequired,
		presetTitle: PropTypes.string.isRequired,
		setPresetTitle: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	const handleOverlayClick = (e) => {
		if (e.target.classList.contains('saved-modal-overlay')) {
			onClose();
		}
	};

	if (!isOpen) return null;
	return (
		<>
			<div className="saved-modal-overlay" onClick={handleOverlayClick}></div>
			<div className="saved-modal-content" role="dialog" aria-modal="true" aria-labelledby="saved-modal-title">
				<div className="saved-modal-body">
					<div
						className="text-input-container"
						data-tooltip-id="modal-tooltip"
						data-tooltip-content="Enter a name for your preset"
					>
						<label htmlFor="preset-name">Title</label>
						<input
							type="text"
							autoFocus
							autoComplete="off"
							id="preset-name"
							placeholder="New Preset"
							className="title-input"
							aria-label="Preset name"
							value={presetTitle}
							onChange={(e) => setPresetTitle(e.target.value)}
						/>
					</div>
					<button className="save-button" onClick={onSave}>
						Save
					</button>
				</div>
			</div>
		</>
	);
}

// Unsave modal for deleting an existing preset.
function UnsaveModal({ isOpen, onUnsaving, onClose }) {
	UnsaveModal.propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onUnsaving: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	const handleOverlayClick = (e) => {
		if (e.target.classList.contains('unsave-modal-overlay')) {
			onClose();
		}
	};

	if (!isOpen) return null;
	return (
		<>
			<div className="unsave-modal-overlay" onClick={handleOverlayClick}></div>
			<div className="unsave-modal-content" role="dialog" aria-modal="true" aria-labelledby="unsave-modal-title">
				<div className="unsave-modal-body">
					<label htmlFor="unsave-prompt">Delete this preset?</label>
					<div className="buttons">
						<button className="unsave-button" onClick={onClose}>
							No
						</button>
						<button className="cancel-button" onClick={onUnsaving}>
							Yes
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

// Info modal (could be expanded with more content as needed)
function InfoModal({ isOpen, onClose }) {
	InfoModal.propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	if (!isOpen) return null;
	return <div className="info-modal-overlay" onClick={onClose}></div>;
}



/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
function CanvasBox({ bezierValues, setBezierValue, presetArray, setPresetArray }) {
	CanvasBox.propTypes = {
		bezierValues: PropTypes.object.isRequired,
		setBezierValue: PropTypes.func.isRequired,
		presetArray: PropTypes.array.isRequired,
		setPresetArray: PropTypes.func.isRequired,
	};
	
	// Local state and refs
	const [snapToGrid, setSnapToGrid] = useState(false);
	const fitToScreenRef = useRef(null);
	const saveRef = useRef(null);

	const matchingPreset = presetArray.find((preset) => areBezierValuesEqual(preset.bezierValue, bezierValues));

	// Save/unsave states
	const [isSavedPromptOpen, setIsSavePromptOpen] = useState(false);
	const [isUnsavePromptOpen, setIsUnsavePromptOpen] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [saveTooltip, setSaveTooltip] = useState("Save");
	const [presetTitle, setPresetTitle] = useState('');

	// Settings and info states
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [stepIndex, setStepIndex] = useState(defaultSnapStepIndex);
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	/* ---------------------- Event Handlers ---------------------- */

	// Handle change for the curve value inputs.
	const handleCurveValueChange = (controlPoint, axis, value) => {
		const updatedValue = parseFloat(value);
		setBezierValue((prevValues) => ({
			...prevValues,
			[controlPoint]: {
				...prevValues[controlPoint],
				[axis]: updatedValue,
			},
		}));
	};

	// Handler for the settings slider change.
	const handleStepChange = (e) => {
		setStepIndex(parseInt(e.target.value, 10));
	};

	// Save/unsave handlers
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

	const handleSavingPreset = () => {
		const title = presetTitle.trim() || 'New Preset';
		if (!isSaved) {
			const newPreset = {
				id: uuidv4(),
				title: title,
				bezierValue: bezierValues,
				isFavorite: false,
				isLocked: false,
			};
			setPresetArray((prevArray) => [...prevArray, newPreset]);
		}
		setPresetTitle('');
		setIsSavePromptOpen(false);
	};

	const handleUnsavingPreset = () => {
		setPresetArray((prevArray) =>
			prevArray.filter((preset) => !areBezierValuesEqual(preset.bezierValue, bezierValues))
		);
		setIsUnsavePromptOpen(false);
	};

	// Close modals on Escape key press
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
		<div className="canvas-box">
			{/* Top controls */}
			<div className="canvas-buttons">
				<div className="curve-value-box">
					<CurveInputs bezierValues={bezierValues} onChange={handleCurveValueChange} />
					<div
						className={`btn setting-btn ${isSettingsOpen ? 'active' : ''}`}
						data-tooltip-id="tooltip"
						data-tooltip-content="Snap settings"
						role="button"
						tabIndex={0}
						onClick={() => setIsSettingsOpen((prev) => !prev)}
					>
						<div className={`icon-btn setting-btn-icon ${isSettingsOpen ? 'active' : ''}`}></div>
					</div>
				</div>

				<div
					className={`btn grid-btn ${snapToGrid ? 'active' : ''}`}
					data-tooltip-id="tooltip"
					data-tooltip-content="Snap to Grid"
					role="button"
					tabIndex={0}
					onClick={() => setSnapToGrid((prev) => !prev)}
				>
					<div className={`icon-btn grid-btn-icon ${snapToGrid ? 'active' : ''}`}></div>
				</div>

				<div
					className="btn fit-btn"
					data-tooltip-id="tooltip"
					data-tooltip-content="Default zoom and center"
					role="button"
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
					role="button"
					tabIndex={0}
					onClick={handleSaveClick}
				>
					<div className={`icon-btn save-btn-icon ${isSaved ? 'active' : ''}`}></div>
				</div>

				<div
					className={`btn info-btn ${isInfoOpen ? 'active' : ''}`}
					data-tooltip-id="tooltip"
					data-tooltip-content="Information"
					role="button"
					tabIndex={0}
					onClick={() => setIsInfoOpen(true)}
				>
					<div className={`icon-btn info-btn-icon ${isInfoOpen ? 'active' : ''}`}></div>
				</div>

				<ReactTooltip id="tooltip" place="top" effect="solid" delayShow={150} arrowColor="transparent" />
			</div>

			{/* Canvas component */}
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

			{/* Modals */}
			<SettingsModal
				isOpen={isSettingsOpen}
				snappingSteps={snappingSteps}
				defaultSnapStepIndex={defaultSnapStepIndex}
				stepIndex={stepIndex}
				onStepChange={handleStepChange}
				onClose={() => setIsSettingsOpen(false)}
			/>
			<SaveModal
				isOpen={isSavedPromptOpen}
				presetTitle={presetTitle}
				setPresetTitle={setPresetTitle}
				onSave={handleSavingPreset}
				onClose={() => setIsSavePromptOpen(false)}
			/>
			<UnsaveModal
				isOpen={isUnsavePromptOpen}
				onUnsaving={handleUnsavingPreset}
				onClose={() => setIsUnsavePromptOpen(false)}
			/>
			<InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

			<ReactTooltip id="modal-tooltip" place="top" effect="solid" delayShow={100} arrowColor="transparent" />
		</div>
	);
}

export default CanvasBox;
