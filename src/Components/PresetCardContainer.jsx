import { useEffect, useState } from 'react';
import '../Styles/presetCardContainer.css';
import PresetCard from './PresetCard';
import { PropTypes } from 'prop-types';



PresetCardContainer.propTypes = {
	setBezierValuesPreset: PropTypes.func.isRequired,
	presetArray: PropTypes.array.isRequired,
	setPresetTitle: PropTypes.func.isRequired
}

function PresetCardContainer({ setBezierValuesPreset, setPresetTitle, presetArray }) {

	// sort presets to have the favorites at the top
	const sortedPresets = [...presetArray].sort((a, b) => b.isFavorite - a.isFavorite);

	// state to tract the active preset
	const [activePresetId, setActivePresetId] = useState(null);

	useEffect(() => {
		// Find the "Linear" preset by title
		const linearPreset = presetArray.find(preset => preset.title === 'Linear');
		if (linearPreset && !activePresetId) { // Only set if not already set
			setActivePresetId(linearPreset.id);
		}
	}, [presetArray, activePresetId]);

	return (
		<div className="preset-card-container">

			{sortedPresets.map((preset) => (
				<PresetCard 
					key={preset.id}
					id={preset.id} 
					title={preset.title} 
					bezierValue={preset.bezierValue} 
					setBezierValuesPreset={setBezierValuesPreset}
					setPresetTitle={setPresetTitle}
					isActive={preset.id === activePresetId}
					setActivePresetId={setActivePresetId}
				/>
			))}

		</div>
	)

}

export default PresetCardContainer