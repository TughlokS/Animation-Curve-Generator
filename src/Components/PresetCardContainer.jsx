import '../Styles/presetCardContainer.css';
import PresetCard from './PresetCard';
import { PropTypes } from 'prop-types';



PresetCardContainer.propTypes = {
	setBezierValuesPreset: PropTypes.func.isRequired,
	presetArray: PropTypes.array.isRequired
}

function PresetCardContainer({ setBezierValuesPreset, presetArray }) {

	return (
		<div className="preset-card-container">

			{presetArray.map((preset, index) => (
				<PresetCard 
					key={index} 
					title={preset.title} 
					bezierValue={preset.bezierValue} 
					setBezierValuesPreset={setBezierValuesPreset}
				/>
			))}

		</div>
	)
	
}

export default PresetCardContainer