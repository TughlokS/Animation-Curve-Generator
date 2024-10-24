import '../Styles/popupPrompt.css';
import { PropTypes } from 'prop-types';



PopupSettingsPrompt.propTypes = {
	onClose: PropTypes.func.isRequired
}

function PopupSettingsPrompt({ onClose }) {

	const handleContentClick = (e) => {
		e.stopPropagation();
	}


	return (

		<div className="popup-overlay" onClick={onClose}>

			<div className="popup-content" onClick={handleContentClick}>

				<h2>Title</h2>

				<p></p>

			</div>

		</div>

	);
}

export default PopupSettingsPrompt