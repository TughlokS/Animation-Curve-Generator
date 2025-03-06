// src/Hooks/usePopup.js
import { useContext } from 'react';
import { PopupContext } from '../Components/PopupContext';
import { PopupPositions } from '../Constants/popupConstants';

const usePopup = () => {
    const { showPopup } = useContext(PopupContext);

    const triggerPopup = ({
        content,
        icon = null,
        duration = 2000,
        position = PopupPositions.SCREEN_TOP_RIGHT,
        targetRef = null,
        unique = false,
        type = null,
    }) => {
        showPopup({ content, icon, duration, position, targetRef, unique, type });
    };

    return { triggerPopup };
};

export default usePopup;
