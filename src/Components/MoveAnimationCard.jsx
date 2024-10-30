/* eslint-disable react/prop-types */

import '../Styles/moveAnimationCard.css';
import { useEffect, useRef, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import useOverflow from '../Hooks/useOverFlow'; // Adjust the path as necessary
import usePopup from '../Hooks/usePopup';




function MoveAnimationCard({ 
    title = "Name", 
    bezierValues,
    backgroundColor = "#22262e",
    animationSpeed = 0.5,
    nextAnimationDelay = 0.5,
}) {

    // Refs for title and body text
    const titleRef = useRef(null);
    const bodyTextRef = useRef(null);

    /* ------------- // CUSTOM HOOKS FOR TEXT OVERFLOW DETECTION \\ ------------- */
    const isTitleOverflowing = useOverflow(titleRef);
    const isBodyOverflowing = useOverflow(bodyTextRef);
    /* ------------- // CUSTOM HOOKS FOR TEXT OVERFLOW DETECTION \\ ------------- */

    const { triggerPopup } = usePopup();



    /* -------------------------------------------------------------------------- */
    /*               // HANDLES COPING TO CLIPBOARD FUNCTIONALITY \\              */
    /* -------------------------------------------------------------------------- */
    const handleCopy = () => {
        const bezierString = `cubic-bezier(${bezierValues.cp1.X}, ${bezierValues.cp1.Y}, ${bezierValues.cp2.X}, ${bezierValues.cp2.Y})`;
        navigator.clipboard.writeText(bezierString)
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
    /* -------------------------------------------------------------------------- */
    /*               // HANDLES COPING TO CLIPBOARD FUNCTIONALITY \\              */
    /* -------------------------------------------------------------------------- */



    /* ------------- // DYNAMICALLY SETS BG COLOR OF COPY BUTTON \\ ------------- */
    const [currentCopyBtnBackgroundColor, setCurrentCopyBtnBackgroundColor] = useState("transparent");
    /* ------------- // DYNAMICALLY SETS BG COLOR OF COPY BUTTON \\ ------------- */



    /* -------------------------------------------------------------------------- */
    /*                 HANDLES TRANSLATION AND ANIMATION OF OBJECT                */
    /* -------------------------------------------------------------------------- */
    /* ---------------- handles calculation of transition amount ---------------- */
    const [translationAmount, setTranslationAmount] = useState("0px");
    const [innerWidth, setInnerWidth] = useState(0);
    const containerRef = useRef(null);
    
	useEffect(() => {
		const element = containerRef.current;
		if (!element) return;

		const styles = window.getComputedStyle(element);
		const paddingRight = parseFloat(styles.paddingRight) || 0;
		const paddingLeft = parseFloat(styles.paddingLeft) || 0;

		const calculateInnerWidth = () => {
            const aniObjWidth = 50;
            const calculatedInnerWidth = element.clientWidth - paddingLeft - paddingRight - aniObjWidth;
            setInnerWidth(calculatedInnerWidth);
		};

        calculateInnerWidth();

        const resizeObserver = new ResizeObserver(() => {
            calculateInnerWidth();
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        };
	}, []);


    /* ------------------------- handles animation loop ------------------------- */
    useEffect(() => {
        if (innerWidth <= 0) return; // No space to animate

        // Calculate the total interval time (animation + delay)
        const totalIntervalTime = (animationSpeed + nextAnimationDelay) * 1000;

        const interval = setInterval(() => {
            setTranslationAmount(prev => prev === "0px" ? `${innerWidth}px` : "0px");
        }, totalIntervalTime);

        // Initial trigger to start the animation
        setTranslationAmount(`${innerWidth}px`);

        return () => {
            clearInterval(interval);
        };
    }, [innerWidth, animationSpeed, nextAnimationDelay]);
    /* -------------------------------------------------------------------------- */
    /*                 HANDLES TRANSLATION AND ANIMATION OF OBJECT                */
    /* -------------------------------------------------------------------------- */



    return (
        <div className="move-animation-card" ref={containerRef}>

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
                        data-tooltip-content={isBodyOverflowing ? `${bezierValues.cp1.X}, ${bezierValues.cp1.Y}, ${bezierValues.cp2.X}, ${bezierValues.cp2.Y}` : undefined}
                        aria-label={isBodyOverflowing ? `${bezierValues.cp1.X}, ${bezierValues.cp1.Y}, ${bezierValues.cp2.X}, ${bezierValues.cp2.Y}` : ''}
                    >
                        {`${bezierValues.cp1.X}, ${bezierValues.cp1.Y}, ${bezierValues.cp2.X}, ${bezierValues.cp2.Y}`}
                    </p>
                </div>

                <div 
                    className="animation-copy-btn"
                    data-tooltip-id="copy-tooltip" 
                    data-tooltip-content="Copy"
                    aria-label="Copy"
                    onMouseEnter={() => setCurrentCopyBtnBackgroundColor(backgroundColor)}
                    onMouseLeave={() => setCurrentCopyBtnBackgroundColor("transparent")}
                    style={{ backgroundColor: currentCopyBtnBackgroundColor }}
                    onClick={handleCopy}
                    role="button"
                    tabIndex={0}
                >
                    <div className="animation-copy-btn-icon"></div>
                </div>
            </div>


            {/* MAIN ANIMATION OBJECT */}
            <div 
                style={{ 
                    backgroundColor,
                    transform: `translateX(${translationAmount})`,
                    transition: `transform ${animationSpeed}s cubic-bezier(${bezierValues.cp1.X}, ${bezierValues.cp1.Y}, ${bezierValues.cp2.X}, ${bezierValues.cp2.Y})`
                }}
                className="move-animation-object"
            ></div>
            {/* MAIN ANIMATION OBJECT */}


            {/* Tooltips */}
            <ReactTooltip
                id="title-tooltip"
                place="top"
                effect="solid"
                delayShow={400}
                arrowColor='transparent'
                className="custom-animation-card-tooltip"
            />
            <ReactTooltip
                id="body-tooltip"
                place="top"
                effect="solid"
                delayShow={400}
                arrowColor='transparent'
                className="custom-animation-card-tooltip"
            />
            <ReactTooltip
                id="copy-tooltip"
                place="top"
                effect="solid"
                delayShow={400}
                arrowColor='transparent'
                // style={{ backgroundColor: currentCopyBtnBackgroundColor }}
                className="custom-animation-card-tooltip"
            />

        </div>
    );

}

export default MoveAnimationCard;
