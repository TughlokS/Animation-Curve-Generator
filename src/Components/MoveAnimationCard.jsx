/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import '../Styles/moveAnimationCard.css';
import { useRef } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import useOverflow from './useOverFlow'; // Adjust the path as necessary
import usePopup from './usePopup';



function MoveAnimationCard({ 
    title = "Name", 
    bodyText = "0.0, 0.0, 1.0, 1.0", 
    backgroundColor = "#22262e" 
}) {

    // Refs for title and body text
    const titleRef = useRef(null);
    const bodyTextRef = useRef(null);

    // Using the custom hook to detect overflow
    const isTitleOverflowing = useOverflow(titleRef);
    const isBodyOverflowing = useOverflow(bodyTextRef);

    const { triggerPopup } = usePopup();

    const handleCopy = () => {
        navigator.clipboard.writeText(`cubic-bezier(${bodyText})`)
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
        <div className="move-animation-card">

            <div className="animation-card-header">
                <div className="title-body">
                    <p
                        className="animation-title"
                        ref={titleRef}
                        data-tooltip-id={isTitleOverflowing ? "title-tooltip" : undefined}
                        data-tooltip-content={isTitleOverflowing ? title : undefined}
                        aria-label={isTitleOverflowing ? title : ''}
                    >
                        {title}
                    </p>
                    <p
                        className="animation-body"
                        ref={bodyTextRef}
                        data-tooltip-id={isBodyOverflowing ? "body-tooltip" : undefined}
                        data-tooltip-content={isBodyOverflowing ? bodyText : undefined}
                        aria-label={isBodyOverflowing ? bodyText : ''}
                    >
                        {bodyText}
                    </p>
                </div>

                <div 
                    className="animation-copy-btn"
                    data-tooltip-id="copy-tooltip" 
                    data-tooltip-content="Copy"
                    aria-label="Copy"
                    onClick={handleCopy}
                    role="button"
                    tabIndex={0}
                >
                    <div className="animation-copy-btn-icon"></div>
                </div>
            </div>

            <div style={{ backgroundColor }} className="move-animation-object"></div>

            {/* Tooltips */}
            <ReactTooltip
                id="title-tooltip"
                place="top"
                effect="solid"
                delayShow={150}
                arrowColor='transparent'
                className="custom-animation-card-tooltip"
            />
            <ReactTooltip
                id="body-tooltip"
                place="top"
                effect="solid"
                delayShow={150}
                arrowColor='transparent'
                className="custom-animation-card-tooltip"
            />
            <ReactTooltip
                id="copy-tooltip"
                place="top"
                effect="solid"
                delayShow={150}
                arrowColor='transparent'
                className="custom-animation-card-tooltip"
            />

        </div>
    );

}

export default MoveAnimationCard;
