// src/Hooks/usePopup.js
import { useContext } from 'react';
import { PopupContext } from './PopupContext';

const usePopup = () => {
  const { showPopup } = useContext(PopupContext);

  const triggerPopup = ({
    content,
    icon = null,
    duration = 2000,
    position = 'top-cursor',
    targetRef = null,
  }) => {
    showPopup({ content, icon, duration, position, targetRef });
  };

  return { triggerPopup };
};

export default usePopup;
