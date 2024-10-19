import CanvasGroup from './Components/CanvasGroup.jsx';
import AnimationGroup from './Components/AnimationGroup.jsx';
import { useState } from 'react';



function App() {

	const [bezierValues, setBezierValues] = useState({
		cp1: { X: 0, Y: 0 },
		cp2: { X: 1, Y: 1 },
	});

	const [bezierValuesPreset, setBezierValuesPreset] = useState({
		cp1: { X: 0, Y: 0 },
		cp2: { X: 1, Y: 1 },
	});

	const bezierValuesLinear = {
		cp1: { X: 0, Y: 0 },
		cp2: { X: 1, Y: 1 },
	}

	return (
		<div className="main-container">

			<div className="enclosed-container">

				<CanvasGroup 
					bezierValues={bezierValues} 
					setBezierValues={setBezierValues} 
					setBezierValuesPreset={setBezierValuesPreset}
				/>

				<AnimationGroup 
					bezierValuesCurve={bezierValues}
					bezierValuesPreset={bezierValuesPreset} 
					bezierValuesLinear={bezierValuesLinear}
				/>

			</div>

		</div>
	)
}

export default App
