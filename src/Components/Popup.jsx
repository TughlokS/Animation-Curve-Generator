// src/Components/Popup.jsx
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../Styles/popup.css';
import { PopupPositions } from '../Constants/popupConstants';
import { useEffect, useRef, useState } from 'react';



const Popup = ({
	isVisible,
	content,
	icon,
	duration = 2000,
	position = 'top-cursor',
	targetRef,
	onClose,
}) => {

	Popup.propTypes = {
		isVisible: PropTypes.bool.isRequired,
		content: PropTypes.string.isRequired,
		icon: PropTypes.element,
		duration: PropTypes.number,
		position: PropTypes.oneOf(Object.values(PopupPositions)),
		targetRef: PropTypes.object, // Reference to the target object for 'obj' positions
		onClose: PropTypes.func.isRequired,
	};


	// determine the width of the popup
	const popupRef = useRef(null);
	const [popupWidth, setPopupWidth] = useState(0);
	const [popupHeight, setPopupHeight] = useState(0);


	useEffect(() => {
		if (popupRef.current) {
			setPopupWidth(popupRef.current.offsetWidth);
			setPopupHeight(popupRef.current.offsetHeight);
		}
	}, [isVisible])


	// disappear after x duration
	useEffect(() => {
		let timer;
		if (isVisible) {
			timer = setTimeout(() => {
				onClose();
			}, duration);
		}
		return () => clearTimeout(timer);
	}, [isVisible, duration, onClose]);
	
	
	// If not visible, return null
	if (!isVisible) return null;



	// Calculate popup position
	const getPositionStyle = () => {
		const offset = 45;
		
		// cursor position
		if (position.startsWith('cursor')) {
			// Position relative to the cursor
			const x = 0;
			const y = 0;
			let top, left;

			switch (position) {
				case PopupPositions.CURSOR_TOP:
					top = y - popupHeight - offset;
					left = x - popupWidth / 2;
					break;
				case PopupPositions.CURSOR_BOTTOM:
					top = y + offset;
					left = x - popupWidth / 2;
					break;
				case PopupPositions.CURSOR_LEFT:
					top = y - popupHeight / 2;
					left = x - popupWidth - offset;
					break;
				case PopupPositions.CURSOR_RIGHT:
					top = y - popupHeight / 2;
					left = x + offset;
					break;
				default:
					top = y - popupHeight - offset;
					left = x - popupWidth / 2;
			}

			// Prevent popup from going off-screen
			top = Math.max(10, Math.min(top, window.innerHeight - popupHeight - 10));
			left = Math.max(10, Math.min(left, window.innerWidth - popupWidth - 10));

			return { top, left };

		// object position
		} else if (position.startsWith('object') && targetRef && targetRef.current) {
			// Position relative to a specific object
			const rect = targetRef.current.getBoundingClientRect();
			let top, left;
			const adjustedOffset = offset / 3;

			switch (position) {
				case PopupPositions.OBJECT_TOP:
					top = rect.top - popupHeight - adjustedOffset;
					left = rect.left + (rect.width / 2) - (popupWidth / 2);
					break;
				case PopupPositions.OBJECT_BOTTOM:
					top = rect.bottom + adjustedOffset;
					left = rect.left + (rect.width / 2) - (popupWidth / 2);
					break;
				case PopupPositions.OBJECT_LEFT:
					top = (rect.top + (rect.height / 2)) - (popupHeight / 2);
					left = (rect.left - popupWidth) - adjustedOffset;
					break;
				case PopupPositions.OBJECT_RIGHT:
					top = (rect.top + (rect.height / 2)) - (popupHeight / 2);
					left = rect.right + adjustedOffset;
					break;
				default:
					top = rect.top - popupHeight - adjustedOffset;
					left = rect.left + (rect.width / 2) - (popupWidth / 2);
			}

			// Prevent popup from going off-screen
			top = Math.max(10, Math.min(top, window.innerHeight - 50));
			left = Math.max(10, Math.min(left, window.innerWidth - 200));

			return { top, left };

		} else if (position.startsWith('screen')) {
			// Position relative to the screen
			let top, left;
			switch (position) {
				case PopupPositions.SCREEN_TOP_LEFT:
					top = offset;
					left = offset;
					break;
				case PopupPositions.SCREEN_TOP_CENTER:
					top = offset;
					left = window.innerWidth / 2;
					break;
				case PopupPositions.SCREEN_TOP_RIGHT:
					top = offset;
					left = window.innerWidth - offset;
					break;
				case PopupPositions.SCREEN_CENTER:
					top = window.innerHeight / 2;
					left = window.innerWidth / 2;
					break;
				case PopupPositions.SCREEN_BOTTOM_LEFT:
					top = window.innerHeight - offset;
					left = offset;
					break;
				case PopupPositions.SCREEN_BOTTOM_CENTER:
					top = window.innerHeight - offset;
					left = window.innerWidth / 2;
					break;
				case PopupPositions.SCREEN_BOTTOM_RIGHT:
					top = window.innerHeight - offset;
					left = window.innerWidth - offset;
					break;
				case PopupPositions.SCREEN_LEFT_CENTER:
					top = window.innerHeight / 2;
					left = offset;
					break;
				case PopupPositions.SCREEN_RIGHT_CENTER:
					top = window.innerHeight / 2;
					left = window.innerWidth - offset;
					break;
				default:
					top = window.innerHeight / 2;
					left = window.innerWidth / 2;
			}

			// Adjust for popup dimensions (assuming fixed size, adjust as necessary)
			const popupWidth = 200; // Example width
			const popupHeight = 50; // Example height
			// Center the popup around the position
			top = top - popupHeight / 2;
			left = left - popupWidth / 2;
			// Ensure the popup stays within the viewport
			top = Math.max(10, Math.min(top, window.innerHeight - popupHeight - 10));
			left = Math.max(10, Math.min(left, window.innerWidth - popupWidth - 10));

			return { top, left };

		} else {
			console.log("Error retrieving copy popup position!")
			console.log(targetRef, position);
			position = 'screen-top-center';
		}
		// Default position
		return { top: '2%', left: '50%' };
	};

	const positionStyle = getPositionStyle();

	return ReactDOM.createPortal(
		<div
			className={`popup popup-${position}`}
			style={positionStyle}
			role='alert'
			aria-live='assertive'
			ref={popupRef}
		>
			{icon && <span className='popup-icon'>{icon}</span>}
			<span className='popup-content'>{content}</span>
		</div>,
		document.body,
	);
};

export default Popup;
