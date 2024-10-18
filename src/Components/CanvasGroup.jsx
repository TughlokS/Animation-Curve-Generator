import '../Styles/canvasGroup.css'
import SearchBox from './SearchBox';
import PresetCardContainer from './PresetCardContainer';
import CanvasBox from './CanvasBox';
import { PropTypes } from 'prop-types'



CanvasGroup.propTypes = {
	bezierValues: PropTypes.object.isRequired,
	setBezierValues: PropTypes.func.isRequired,
	setBezierValuesPreset: PropTypes.func.isRequired
};

function CanvasGroup({ bezierValues, setBezierValues, setBezierValuesPreset }) {

	

	return (
		<div className="canvas-group">

			<CanvasBox bezierValues={bezierValues} setBezierValue={setBezierValues}/>

			<SearchBox />

			<PresetCardContainer setBezierValuesPreset={setBezierValuesPreset} />

		</div>
	);
}

export default CanvasGroup