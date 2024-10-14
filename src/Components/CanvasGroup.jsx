import '../Styles/canvasGroup.css'
import SearchBox from './SearchBox';
import PresetCardContainer from './PresetCardContainer';
import CanvasBox from './CanvasBox';



function CanvasGroup() {
	return (
		<div className="canvas-group">

			<SearchBox />

			<PresetCardContainer />

			<CanvasBox />

		</div>
	);
}

export default CanvasGroup