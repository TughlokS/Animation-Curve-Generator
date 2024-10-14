// src/Components/Popup.jsx
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../Styles/popup.css';
import { useEffect } from 'react';


const Popup = ({
	isVisible,
	content,
	icon,
	duration = 2000,
	position = 'top-cursor',
	targetRef,
	onClose,
  }) => {
	useEffect(() => {
	  let timer;
	  if (isVisible) {
		timer = setTimeout(() => {
		  onClose();
		}, duration);
	  }
	  return () => clearTimeout(timer);
	}, [isVisible, duration, onClose]);
  
	if (!isVisible) return null;
  
	// Calculate popup position
	const getPositionStyle = () => {
	  const offset = 45; // 45px offset for screen positions
	  if (position.includes('cursor')) {
		// Position relative to the cursor
		const { clientX: x, clientY: y } = window.event || {};
		let top, left;
  
		switch (position) {
		  case 'top-cursor':
			top = y - offset;
			left = x + offset;
			break;
		  case 'bottom-cursor':
			top = y + offset;
			left = x + offset;
			break;
		  case 'left-cursor':
			top = y + offset;
			left = x - offset;
			break;
		  case 'right-cursor':
			top = y + offset;
			left = x + offset;
			break;
		  default:
			top = y + offset;
			left = x + offset;
		}
  
		// Prevent popup from going off-screen
		top = Math.max(10, Math.min(top, window.innerHeight - 50));
		left = Math.max(10, Math.min(left, window.innerWidth - 200));
  
		return { top, left };
	  } else if (position.includes('obj') && targetRef && targetRef.current) {
		// Position relative to a specific object
		const rect = targetRef.current.getBoundingClientRect();
		let top, left;
  
		switch (position) {
		  case 'top-obj':
			top = rect.top - offset;
			left = rect.left;
			break;
		  case 'bottom-obj':
			top = rect.bottom + offset;
			left = rect.left;
			break;
		  case 'left-obj':
			top = rect.top;
			left = rect.left - offset;
			break;
		  case 'right-obj':
			top = rect.top;
			left = rect.right + offset;
			break;
		  default:
			top = rect.bottom + offset;
			left = rect.left;
		}
  
		// Prevent popup from going off-screen
		top = Math.max(10, Math.min(top, window.innerHeight - 50));
		left = Math.max(10, Math.min(left, window.innerWidth - 200));
  
		return { top, left };
	  } else if (position.startsWith('screen-')) {
		// Position relative to the screen
		let top, left;
		switch (position) {
		  case 'screen-top-left':
			top = offset;
			left = offset;
			break;
		  case 'screen-top-center':
			top = offset;
			left = window.innerWidth / 2;
			break;
		  case 'screen-top-right':
			top = offset;
			left = window.innerWidth - offset;
			break;
		  case 'screen-center':
			top = window.innerHeight / 2;
			left = window.innerWidth / 2;
			break;
		  case 'screen-bottom-left':
			top = window.innerHeight - offset;
			left = offset;
			break;
		  case 'screen-bottom-center':
			top = window.innerHeight - offset;
			left = window.innerWidth / 2;
			break;
		  case 'screen-bottom-right':
			top = window.innerHeight - offset;
			left = window.innerWidth - offset;
			break;
		  case 'screen-left-center':
			top = window.innerHeight / 2;
			left = offset;
			break;
		  case 'screen-right-center':
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
	  }
	  // Default position
	  return { top: '50%', left: '50%' };
	};
  
	const positionStyle = getPositionStyle();
  
	return ReactDOM.createPortal(
	  <div className={`popup popup-${position}`} style={positionStyle} role="alert" aria-live="assertive">
		{icon && <span className="popup-icon">{icon}</span>}
		<span className="popup-content">{content}</span>
	  </div>,
	  document.body
	);
  };
  
  Popup.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	content: PropTypes.string.isRequired,
	icon: PropTypes.element,
	duration: PropTypes.number,
	position: PropTypes.oneOf([
	  'top-cursor',
	  'bottom-cursor',
	  'left-cursor',
	  'right-cursor',
	  'top-obj',
	  'bottom-obj',
	  'left-obj',
	  'right-obj',
	  // New screen-based positions
	  'screen-top-left',
	  'screen-top-center',
	  'screen-top-right',
	  'screen-center',
	  'screen-bottom-left',
	  'screen-bottom-center',
	  'screen-bottom-right',
	  'screen-left-center',
	  'screen-right-center',
	]),
	targetRef: PropTypes.object, // Reference to the target object for 'obj' positions
	onClose: PropTypes.func.isRequired,
  };
  
  export default Popup;