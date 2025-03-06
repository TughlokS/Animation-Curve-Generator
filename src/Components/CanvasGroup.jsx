import '../Styles/canvasGroup.css'
import SearchBox from './SearchBox';
import PresetCardContainer from './PresetCardContainer';
import CanvasBox from './CanvasBox';
import { PropTypes } from 'prop-types'
import { useEffect, useState } from 'react';
import {v4 as uuidv4} from 'uuid';





function CanvasGroup({ setMainPresetArray, bezierValues, setBezierValues, setBezierValuesPreset, setPresetTitle }) {

	CanvasGroup.propTypes = {
		setMainPresetArray: PropTypes.func.isRequired,
		bezierValues: PropTypes.object.isRequired,
		setBezierValues: PropTypes.func.isRequired,
		setBezierValuesPreset: PropTypes.func.isRequired,
		setPresetTitle: PropTypes.func.isRequired
	};

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
			return JSON.parse(savedPresets).sort((a, b) => a.title.localeCompare(b.title));
		} else {
			return defaultArray.sort((a, b) => a.title.localeCompare(b.title));
		}
	});


	const [filteredPresets, setFilteredPresets] = useState(presetArray);


	// save to local storage whenever presetArray changes
	useEffect(() => {
		localStorage.setItem('presetArray', JSON.stringify(presetArray));
		setFilteredPresets(presetArray);
	}, [presetArray]);


	// update mainPreset for curve title change
	useEffect(() => {
		setMainPresetArray(presetArray);
	}, [presetArray, setMainPresetArray]);


	// handle search
	const handleSearch = (query) => {
		if (!query.trim()) {
			setFilteredPresets(presetArray);
			return;
		}
	
		const lowerQuery = query.toLowerCase();
	
		// Split into matches and non-matches
		const matches = [];
		const nonMatches = [];
	
		presetArray.forEach((preset) => {
			const titleMatch = preset.title.toLowerCase().includes(lowerQuery);
			const bezierStr = `${preset.bezierValue.cp1.X},${preset.bezierValue.cp1.Y},${preset.bezierValue.cp2.X},${preset.bezierValue.cp2.Y}`;
			const bezierMatch = bezierStr.includes(lowerQuery.replace(/\s+/g, ''));
	
			if (titleMatch || bezierMatch) {
				matches.push(preset);
			} else {
				nonMatches.push(preset);
			}
		});
	
		// Sort both arrays alphabetically by title
		matches.sort((a, b) => a.title.localeCompare(b.title));
		nonMatches.sort((a, b) => a.title.localeCompare(b.title));
	
		// Concatenate matches followed by non-matches
		const sortedResult = [...matches, ...nonMatches];
	
		setFilteredPresets(sortedResult);
	};



	return (
		<div className="canvas-group">

			<CanvasBox 
				bezierValues={bezierValues} 
				setBezierValue={setBezierValues}
				presetArray={presetArray}
				setPresetArray={setPresetArray}
			/>

			<SearchBox onSearch={handleSearch}/>

			<PresetCardContainer 
				setBezierValuesPreset={setBezierValuesPreset} 
				setPresetTitle={setPresetTitle}
				presetArray={filteredPresets}
			/>

		</div>
	);
}

export default CanvasGroup