import '../Styles/canvasGroup.css'
import SearchBox from './SearchBox';
import PresetCardContainer from './PresetCardContainer';
import CanvasBox from './CanvasBox';
import { PropTypes } from 'prop-types'
import { useState } from 'react';



CanvasGroup.propTypes = {
	bezierValues: PropTypes.object.isRequired,
	setBezierValues: PropTypes.func.isRequired,
	setBezierValuesPreset: PropTypes.func.isRequired
};

function CanvasGroup({ bezierValues, setBezierValues, setBezierValuesPreset }) {

	const [presetArray, setPresetArray] = useState([ 
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
				cp1: { X: 1, Y: 0 },
				cp2: { X: 0, Y: 1 },
			}
		},
		{
			title: 'Overshoot',
			bezierValue: {
				cp1: { X: 0, Y: 1 },
				cp2: { X: 0, Y: 1 },
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
			title: 'Glitch',
			bezierValue: {
				cp1: { X: 1, Y: 2 },
				cp2: { X: 0, Y: -1 },
			}
		}
	]);



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
				presetArray={presetArray}
			/>

		</div>
	);
}

export default CanvasGroup