import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const duration = 800; // Duration in milliseconds
    const start = window.scrollY;
    const startTime = performance.now();

    // Easing function for a smoother effect (easeInOutCubic)
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const scroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      window.scrollTo(0, start - (start * easeInOutCubic(progress)));

      if (timeElapsed < duration) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
