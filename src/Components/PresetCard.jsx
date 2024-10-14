import { useId, useRef } from 'react';
import '../Styles/presetCard.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import PropTypes from 'prop-types';
import useOverflow from './useOverFlow';
import usePopup from './usePopup';
// import {FaCheckCircle} from 'react-icons/fa';



function PresetCard({ 
    title = "Preset Name", 
    bodyText = "0.0, 0.0, 1.0, 1.0," 
}) {

    const uniqueId = useId();

    const titleTooltipID = `title-tooltip-${uniqueId}`;
    const bodyTextTooltipID = `body-text-tooltip-${uniqueId}`;
    const copyIconTooltipID = `copy-icon-tooltip-${uniqueId}`;

	const bodyTextRef = useRef(null);
	const titleRef = useRef(null);

    const isBodyOverflowing = useOverflow(bodyTextRef);
    const isHeaderOverflowing = useOverflow(titleRef);

    const { triggerPopup } = usePopup();

    const handleCopy = () => {
        const copyText = `cubic-bezier(${bodyText})`;
        navigator.clipboard.writeText(copyText)
            .then(() => {
                triggerPopup({
                    content: `Copied`,
                    // icon: <FaCheckCircle/>,
                    duration: 500,
                    position: 'screen-top-center',
                })
            })
            .catch(err => {
                console.error('Failed to copy!', err);
            });
    };

    return (
        <div className="preset-card">

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
				ref={bodyTextRef}
                data-tooltip-id={ isBodyOverflowing ? bodyTextTooltipID : undefined }
                data-tooltip-content={ isBodyOverflowing ? bodyText : undefined }
            >
                {bodyText}
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

PresetCard.propTypes = {
    title: PropTypes.string,
    bodyText: PropTypes.string
}

export default PresetCard;