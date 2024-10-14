// src/hooks/useOverflow.js
import { useLayoutEffect, useState } from 'react';

function useOverflow(ref) {
    const [isOverflowing, setIsOverflowing] = useState(false);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            const element = ref.current;
            if (element) {
                const isOverflow = element.scrollWidth > element.clientWidth;
                setIsOverflowing(isOverflow);
            }
        };

        checkOverflow();

        // Debounce the resize handler for performance
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                checkOverflow();
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [ref]);

    return isOverflowing;
}

export default useOverflow;
