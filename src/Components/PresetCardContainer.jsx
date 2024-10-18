/* eslint-disable no-unused-vars */
import '../Styles/presetCardContainer.css';
import PresetCard from './PresetCard';
import { PropTypes } from 'prop-types';



PresetCardContainer.propTypes = {
	setBezierValuesPreset: PropTypes.func.isRequired
}

function PresetCardContainer({ setBezierValuesPreset }) {

	/* --------------------------------- presets -------------------------------- */
	const presetArr = [ 
		{
			title: 'Linear',
			bezierValue: {
				cp1: { X: 0, Y: 0 },
				cp2: { X: 1, Y: 1 },
			}
		},
		{
			title: 'Ease',
			bezierValue: {
				cp1: { X: 0.25, Y: 0.1 },
				cp2: { X: 0.25, Y: 1 },
			}
		},
		{
			title: 'Ease-In',
			bezierValue: {
				cp1: { X: 0.42, Y: 0 },
				cp2: { X: 1, Y: 1 },
			}
		},
		{
			title: 'Ease-Out',
			bezierValue: {
				cp1: { X: 0, Y: 0 },
				cp2: { X: 0.58, Y: 1 },
			}
		},
		{
			title: 'Ease-In-Out',
			bezierValue: {
				cp1: { X: 0.42, Y: 0 },
				cp2: { X: 0.58, Y: 1 },
			}
		},
		{
			title: 'Bounce-In',
			bezierValue: {
				cp1: { X: 0.5, Y: -0.5 },
				cp2: { X: 1, Y: 1 },
			}
		},
		{
			title: 'Bounce-Out',
			bezierValue: {
				cp1: { X: 0, Y: 0 },
				cp2: { X: 0.5, Y: 1.5 },
			}
		},
		{
			title: 'Bounce-In-Out',
			bezierValue: {
				cp1: { X: 0.5, Y: -0.5 },
				cp2: { X: 0.5, Y: 1.5 },
			}
		},
		{
			title: 'Anticipate',
			bezierValue: {
				cp1: { X: 1.25, Y: 0 },
				cp2: { X: 0.5, Y: 1 },
			}
		},
		{
			title: 'Overshoot',
			bezierValue: {
				cp1: { X: 0.5, Y: 0 },
				cp2: { X: -0.25, Y: 1 },
			}
		},
		{
			title: 'Lightning',
			bezierValue: {
				cp1: { X: 1, Y: 0 },
				cp2: { X: 0, Y: 1 },
			}
		},
		{
			title: 'Back-In',
			bezierValue: {
				cp1: { X: 0.60, Y: -0.28 },
				cp2: { X: 0.73, Y: 0.05 },
			}
		}
	]


	/* --------------------- handle specific preset clicked --------------------- */




	return (
		<div className="preset-card-container">

			{presetArr.map((preset, index) => (
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