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

	return (
		<div className="preset-card-container">

			{sortedPresets.map((preset, index) => (
				<PresetCard 
					key={index} 
					title={preset.title} 
					bezierValue={preset.bezierValue} 
					setBezierValuesPreset={setBezierValuesPreset}
					setPresetTitle={setPresetTitle}
				/>
			))}

		</div>
	)

}

export default PresetCardContainer