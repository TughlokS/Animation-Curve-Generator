/* eslint-disable react/prop-types */
// src/Context/PopupContext.jsx
import { createContext, useState, useCallback } from 'react';
import Popup from '../Components/Popup';

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popups, setPopups] = useState([]);

  const showPopup = useCallback((popupConfig) => {
    const id = Date.now();
    setPopups((prevPopups) => [...prevPopups, { id, ...popupConfig }]);
  }, []);

  const hidePopup = useCallback((id) => {
    setPopups((prevPopups) => prevPopups.filter((popup) => popup.id !== id));
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      {popups.map((popup) => (
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

