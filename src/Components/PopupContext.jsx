import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Popup from '../Components/Popup';

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
	PopupProvider.propTypes = {
		children: PropTypes.node.isRequired,
	};
	const [popups, setPopups] = useState([]);

	const showPopup = useCallback(popupConfig => {
		const id = Date.now();
		setPopups(prevPopups => {
			// If the popup is marked as unique and has a type, remove any previous popup of the same type.
			if (popupConfig.unique && popupConfig.type) {
				return [
					...prevPopups.filter(p => p.type !== popupConfig.type),
					{ id, ...popupConfig },
				];
			}
			return [...prevPopups, { id, ...popupConfig }];
		});
	}, []);

	const hidePopup = useCallback(id => {
		setPopups(prevPopups => prevPopups.filter(popup => popup.id !== id));
	}, []);

	return (
		<PopupContext.Provider value={{ showPopup }}>
			{children}
			{popups.map(popup => (
				<Popup
					key={popup.id}
					isVisible={true}
					content={popup.content}
					icon={popup.icon}
					duration={popup.duration}
					position={popup.position}
					targetRef={popup.targetRef}
					onClose={() => hidePopup(popup.id)}
				/>
			))}
		</PopupContext.Provider>
	);
};
