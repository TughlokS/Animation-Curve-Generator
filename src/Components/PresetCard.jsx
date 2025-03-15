import { useEffect, useId, useRef, useState } from 'react';
import '../Styles/presetCard.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import PropTypes from 'prop-types';
import useOverflow from '../Hooks/useOverFlow';
import usePopup from '../Hooks/usePopup';
import { PopupPositions } from '../Constants/popupConstants';



function PresetCard({ 
    id,
    title = "Preset Name", 
    bezierValue,
    setBezierValuesPreset,
    setPresetTitle,
    isActive,
    setActivePresetId
}) {
    
    PresetCard.propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string,
        bezierValue: PropTypes.shape({
            cp1: PropTypes.shape({
                X: PropTypes.number.isRequired,
                Y: PropTypes.number.isRequired
            }).isRequired,
            cp2: PropTypes.shape({
                X: PropTypes.number.isRequired,
                Y: PropTypes.number.isRequired
            }).isRequired
        }).isRequired,
        isFavorite: PropTypes.bool,
        isLocked: PropTypes.bool,
        setBezierValuesPreset: PropTypes.func.isRequired,
        setPresetTitle: PropTypes.func.isRequired,
        isActive: PropTypes.bool.isRequired,
        setActivePresetId: PropTypes.func.isRequired
    }

    const uniqueId = useId();
    const { cp1, cp2 } = bezierValue;
    const bezierValueStr = `${cp1.X}, ${cp1.Y}, ${cp2.X}, ${cp2.Y}`;
    const titleTooltipID = `title-tooltip-${uniqueId}`;
    const bodyTextTooltipID = `body-text-tooltip-${uniqueId}`;
    const copyIconTooltipID = `copy-icon-tooltip-${uniqueId}`;

    const cardRef = useRef(null);
	const bezierValueRef = useRef(null);
	const titleRef = useRef(null);
    const copyButtonRef = useRef(null);

    const [showCopyTooltip, setShowCopyTooltip] = useState(true);
    const [isClicked, setIsClicked] = useState(false);
    // const [isActive, setIsActive] = useState(false);

    const isBodyOverflowing = useOverflow(bezierValueRef);
    const isHeaderOverflowing = useOverflow(titleRef);
    const { triggerPopup } = usePopup();



    // set a timer of 500ms to set showCopyTooltip to true
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCopyTooltip(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [showCopyTooltip]);



    // set the transition of the click animation for card
    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.style.setProperty('--card-before-transition', `0.3s cubic-bezier(${bezierValueStr})`);
        } else if (isClicked) {
            console.error('cardRef is not defined');
        }
    }, [bezierValueStr, isClicked]);



    /* ---------------------- handles copying to clipboard ---------------------- */
    const handleCopy = () => {
        setShowCopyTooltip(false);
        const copyText = `cubic-bezier(${bezierValueStr})`;
        navigator.clipboard.writeText(copyText)
            .then(() => {
                triggerPopup({
                    content: `Copied: ${copyText}`,
                    duration: 500,
                    position: PopupPositions.SCREEN_TOP_CENTER,
                    targetRef: copyButtonRef,
                    unique: true, // Ensure uniqueness for copy notifications
                    type: 'copy'
                });
            })
            .catch(err => {
                console.error('Failed to copy!', err);
            });
    };    
    /* ---------------------- handles copying to clipboard ---------------------- */


    /* ------------------------ handles clicking the card ----------------------- */
    const handleCardClick = () => {
        setBezierValuesPreset(bezierValue);
        setPresetTitle(title);
        setActivePresetId(id);
    };
    const handleMouseDown = () => {
        if (!isClicked) {
            // setIsActive(true);
            setIsClicked(true);
            setTimeout(() => setIsClicked(false), 500);
        }
    };
    /* ------------------------ handles clicking the card ----------------------- */



    return (
        <div className={`preset-card ${isClicked ? 'clicked' : ''} ${isActive ? 'active' : ''}`} 
            onMouseDown={handleMouseDown}
            onClick={handleCardClick}
            ref={cardRef}
        >

            <div className="card-header">
                <p
					className="title"
					ref={titleRef}
					data-tooltip-id={ isHeaderOverflowing ? titleTooltipID : undefined }
					data-tooltip-content={ isHeaderOverflowing ? title : undefined }
				>
					{title}
				</p>
                <div 
                    className="copy-btn" 
                    data-tooltip-id={ copyIconTooltipID } 
                    data-tooltip-content="Copy"
                    onClick={handleCopy}
                    role='button'
                    tabIndex={0}
                    ref={copyButtonRef}
                >
                    <div className="copy-btn-icon" ></div>
                </div>
            </div>

            <p
                className="body-text"
				ref={bezierValueRef}
                data-tooltip-id={ isBodyOverflowing ? bodyTextTooltipID : undefined }
                data-tooltip-content={ isBodyOverflowing ? bezierValueStr : undefined }
            >
                {bezierValueStr}
            </p>

            <ReactTooltip 
                id={ titleTooltipID }
                place="top" 
                effect="solid" 
                delayShow={400}
                arrowColor="transparent"
                className="custom-preset-card-tooltip"
                
            />
            <ReactTooltip 
                id={ bodyTextTooltipID } 
                place="top" 
                effect="solid" 
                delayShow={400}
                arrowColor="transparent"
                className="custom-preset-card-tooltip"
            />
            { showCopyTooltip && 
                <ReactTooltip 
                    id={ copyIconTooltipID } 
                    place="top" 
                    effect="solid" 
                    delayShow={400}
                    arrowColor="transparent"
                    className="custom-preset-card-tooltip"
                />
            }

        </div>
    );
}


export default PresetCard;