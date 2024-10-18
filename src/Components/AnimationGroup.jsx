/* eslint-disable no-unused-vars */
import { useState } from 'react';
import '../Styles/animationGroup.css'
import MoveAnimationCard from './MoveAnimationCard'
import { accentColors } from '../Helpers/env';
import { PropTypes } from 'prop-types';



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

			<MoveAnimationCard
				title='Curve' 
				bezierValues={bezierValuesCurve} 
				backgroundColor={accentColors.accent_red}
				animationSpeed={animationSpeed}
				nextAnimationDelay={nextAnimationDelay}
			/>
			<MoveAnimationCard
				title='Preset' 
				bezierValues={bezierValuesPreset}
				backgroundColor={accentColors.accent_blue}
				animationSpeed={animationSpeed}
				nextAnimationDelay={nextAnimationDelay}
			/>
			<MoveAnimationCard
				title='Linear' 
				bezierValues={bezierValuesLinear}
				backgroundColor={accentColors.accent_green}
				animationSpeed={animationSpeed}
				nextAnimationDelay={nextAnimationDelay}
			/>

		</div>
	)
}

export default AnimationGroup