/* eslint-disable no-unused-vars */
import { useState } from 'react';
import '../Styles/animationGroup.css'
import MoveAnimationCard from './MoveAnimationCard'
import { scssColors } from '../Helpers/env';
import { PropTypes } from 'prop-types';
import PopupSettingsPrompt from './PopupSettingsPrompt';



AnimationGroup.propTypes = {
    bezierValuesCurve: PropTypes.shape({
        cp1: PropTypes.shape({
            X: PropTypes.number.isRequired,
            Y: PropTypes.number.isRequired
        }).isRequired,
        cp2: PropTypes.shape({
            X: PropTypes.number.isRequired,
            Y: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,

	bezierValuesPreset: PropTypes.shape({
		cp1: PropTypes.shape({
			X: PropTypes.number.isRequired,
			Y: PropTypes.number.isRequired
		}).isRequired,
		cp2: PropTypes.shape({
			X: PropTypes.number.isRequired,
			Y: PropTypes.number.isRequired
		}).isRequired
	}).isRequired,

	bezierValuesLinear: PropTypes.shape({
		cp1: PropTypes.shape({
			X: PropTypes.number.isRequired,
			Y: PropTypes.number.isRequired
		}).isRequired,
		cp2: PropTypes.shape({
			X: PropTypes.number.isRequired,
			Y: PropTypes.number.isRequired
		}).isRequired
	}).isRequired
};


function AnimationGroup( { bezierValuesCurve, bezierValuesPreset, bezierValuesLinear } ) {
	
	const [animationSpeed, setAnimationSpeed] = useState(0.5);
	const [nextAnimationDelay, setNextAnimationDelay] = useState(0.5);






	return (
		<div className="animation-group">

			<div className="time-slider-container">
				
			</div>

			<MoveAnimationCard
				title='Curve' 
				bezierValues={bezierValuesCurve} 
				backgroundColor={scssColors.accent_red}
				animationSpeed={animationSpeed}
				nextAnimationDelay={nextAnimationDelay}
			/>
			<MoveAnimationCard
				title='Preset' 
				bezierValues={bezierValuesPreset}
				backgroundColor={scssColors.accent_blue}
				animationSpeed={animationSpeed}
				nextAnimationDelay={nextAnimationDelay}
			/>
			<MoveAnimationCard
				title='Linear' 
				bezierValues={bezierValuesLinear}
				backgroundColor={scssColors.accent_green}
				animationSpeed={animationSpeed}
				nextAnimationDelay={nextAnimationDelay}
			/>

			{/* test popupSettingsPrompt */}
			

		</div>
	)
}

export default AnimationGroup