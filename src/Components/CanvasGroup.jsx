import '../Styles/canvasGroup.css'
import SearchBox from './SearchBox';
import PresetCardContainer from './PresetCardContainer';
import CanvasBox from './CanvasBox';
import { PropTypes } from 'prop-types'
import { useEffect, useState } from 'react';
import {v4 as uuidv4} from 'uuid';



CanvasGroup.propTypes = {
	setMainPresetArray: PropTypes.func.isRequired,
	bezierValues: PropTypes.object.isRequired,
	setBezierValues: PropTypes.func.isRequired,
	setBezierValuesPreset: PropTypes.func.isRequired,
	setPresetTitle: PropTypes.func.isRequired
};

function CanvasGroup({ setMainPresetArray, bezierValues, setBezierValues, setBezierValuesPreset, setPresetTitle }) {

	const defaultArray = [ 
		{
			id: uuidv4(),
			title: 'Linear',
			bezierValue: {
				cp1: { X: 0, Y: 0 },
				cp2: { X: 1, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Ease',
			bezierValue: {
				cp1: { X: 0.25, Y: 0.1 },
				cp2: { X: 0.25, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Ease-In',
			bezierValue: {
				cp1: { X: 0.42, Y: 0 },
				cp2: { X: 1, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Ease-Out',
			bezierValue: {
				cp1: { X: 0, Y: 0 },
				cp2: { X: 0.58, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Ease-In-Out',
			bezierValue: {
				cp1: { X: 0.42, Y: 0 },
				cp2: { X: 0.58, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Bounce-In',
			bezierValue: {
				cp1: { X: 0.5, Y: -0.5 },
				cp2: { X: 1, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Bounce-Out',
			bezierValue: {
				cp1: { X: 0, Y: 0 },
				cp2: { X: 0.5, Y: 1.5 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Bounce-In-Out',
			bezierValue: {
				cp1: { X: 0.5, Y: -0.5 },
				cp2: { X: 0.5, Y: 1.5 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Anticipate',
			bezierValue: {
				cp1: { X: 1, Y: 0 },
				cp2: { X: 0, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Overshoot',
			bezierValue: {
				cp1: { X: 0, Y: 1 },
				cp2: { X: 0, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Lightning',
			bezierValue: {
				cp1: { X: 1, Y: 0 },
				cp2: { X: 0, Y: 1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Glitch',
			bezierValue: {
				cp1: { X: 1, Y: 2 },
				cp2: { X: 0, Y: -1 },
			},
			isFavorite: false,
			isLocked: true,
		},
		{
			id: uuidv4(),
			title: 'Bounce',
			bezierValue: {
				cp1: { X: 0.5, Y: 2.2 },
				cp2: { X: 0, Y: 0 },
			},
			isFavorite: false,
			isLocked: true,
		},
	];

	const [presetArray, setPresetArray] = useState(() => {
		const savedPresets = localStorage.getItem('presetArray');
		if (savedPresets) {
			return JSON.parse(savedPresets);
		} else {
			return defaultArray
		}
	});

	// save to local storage whenever presetArray changes
	useEffect(() => {
		localStorage.setItem('presetArray', JSON.stringify(presetArray));
	}, [presetArray]);

	// update mainPreset for curve title change
	useEffect(() => {
		setMainPresetArray(presetArray);
	}, [presetArray, setMainPresetArray]);



	return (
		<div className="canvas-group">

			<CanvasBox 
				bezierValues={bezierValues} 
				setBezierValue={setBezierValues}
				presetArray={presetArray}
				setPresetArray={setPresetArray}
			/>

			<SearchBox />

			<PresetCardContainer 
				setBezierValuesPreset={setBezierValuesPreset} 
				setPresetTitle={setPresetTitle}
				presetArray={presetArray}
			/>

		</div>
	);
}

export default CanvasGroup