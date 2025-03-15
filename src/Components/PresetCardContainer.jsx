/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import '../Styles/presetCardContainer.css';
import PresetCard from './PresetCard';
import { PropTypes } from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';



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

			<AnimatePresence>
				{sortedPresets.map((preset) => (
					// <motion.div
					// 	layout
					// 	key={preset.id}
					// 	initial={{ opacity: 1, y: 20 }}
					// 	animate={{ opacity: 1, y: 0 }}
					// 	exit={{ opacity: 0, y: -20 }}
					// 	style={{ display: 'initial' }}
					// 	className='motion-wrapper'
					// >
					// 	<PresetCard 
					// 		key={preset.id}
					// 		id={preset.id} 
					// 		title={preset.title} 
					// 		bezierValue={preset.bezierValue} 
					// 		setBezierValuesPreset={setBezierValuesPreset}
					// 		setPresetTitle={setPresetTitle}
					// 		isActive={preset.id === activePresetId}
					// 		setActivePresetId={setActivePresetId}
					// 	/>
					// </motion.div>

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
			</AnimatePresence>

		</div>
	)

}

export default PresetCardContainer