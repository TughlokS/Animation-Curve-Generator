import '../Styles/canvasGroup.css'
import SearchBox from './SearchBox';
import PresetCardContainer from './PresetCardContainer';
import CanvasBox from './CanvasBox';
import { PropTypes } from 'prop-types'
import { useEffect, useState } from 'react';
import { defaultPresets } from '../Constants/defaultPresets';
// import {v4 as uuidv4} from 'uuid';





function CanvasGroup({ setMainPresetArray, bezierValues, setBezierValues, setBezierValuesPreset, setPresetTitle }) {

	CanvasGroup.propTypes = {
		setMainPresetArray: PropTypes.func.isRequired,
		bezierValues: PropTypes.object.isRequired,
		setBezierValues: PropTypes.func.isRequired,
		setBezierValuesPreset: PropTypes.func.isRequired,
		setPresetTitle: PropTypes.func.isRequired
	};

	const [presetArray, setPresetArray] = useState(() => {
		const savedPresets = localStorage.getItem('presetArray');
		if (savedPresets) {
			return JSON.parse(savedPresets).sort((a, b) => a.title.localeCompare(b.title));
		} else {
			return defaultPresets.sort((a, b) => a.title.localeCompare(b.title));
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