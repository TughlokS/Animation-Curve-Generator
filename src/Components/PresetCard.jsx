import { useEffect, useId, useRef } from 'react';
import '../Styles/presetCard.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import PropTypes from 'prop-types';
import useOverflow from '../Hooks/useOverFlow';
import usePopup from '../Hooks/usePopup';



PresetCard.propTypes = {
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
    setBezierValuesPreset: PropTypes.func.isRequired
}

function PresetCard({ 
    title = "Preset Name", 
    bezierValue,
    setBezierValuesPreset
}) {

    const uniqueId = useId();

    const { cp1, cp2 } = bezierValue;

    const bezierValueStr = `${cp1.X}, ${cp1.Y}, ${cp2.X}, ${cp2.Y}`;
    const titleTooltipID = `title-tooltip-${uniqueId}`;
    const bodyTextTooltipID = `body-text-tooltip-${uniqueId}`;
    const copyIconTooltipID = `copy-icon-tooltip-${uniqueId}`;

	const bezierValueRef = useRef(null);
	const titleRef = useRef(null);

    const isBodyOverflowing = useOverflow(bezierValueRef);
    const isHeaderOverflowing = useOverflow(titleRef);

    const { triggerPopup } = usePopup();

    

    /* -------------------------------------------------------------------------- */
    /*               // HANDLES COPING TO CLIPBOARD FUNCTIONALITY \\              */
    /* -------------------------------------------------------------------------- */
    const handleCopy = () => {
        const copyText = `cubic-bezier(${bezierValueStr})`;
        navigator.clipboard.writeText(copyText)
            .then(() => {
                triggerPopup({
                    content: `Copied`,
                    duration: 500,
                    position: 'screen-top-center',
                })
            })
            .catch(err => {
                console.error('Failed to copy!', err);
            });
    };
    /* -------------------------------------------------------------------------- */
    /*               // HANDLES COPING TO CLIPBOARD FUNCTIONALITY \\              */
    /* -------------------------------------------------------------------------- */


    /* -------------------------------------------------------------------------- */
    /*                           HANDLES PASSING VALUES                           */
    /* -------------------------------------------------------------------------- */
    const handleCardClick = () => {
        setBezierValuesPreset(bezierValue);
    };
    /* -------------------------------------------------------------------------- */
    /*                           HANDLES PASSING VALUES                           */
    /* -------------------------------------------------------------------------- */
    


    return (
        <div className="preset-card" onClick={handleCardClick}>

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
            <ReactTooltip 
                id={ copyIconTooltipID } 
                place="top" 
                effect="solid" 
                delayShow={400}
                arrowColor="transparent"
                className="custom-preset-card-tooltip"
            />

        </div>
    );
}


export default PresetCard;