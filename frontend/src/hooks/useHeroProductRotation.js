import { useCallback, useEffect, useRef, useState } from 'react';

const TRANSITION_MS = 500;

export const useHeroProductRotation = (itemCount, interval = 2500, resetKey = '') => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitIndex, setExitIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeIndexRef = useRef(activeIndex);
  const exitTimeoutRef = useRef(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex(0);
    setExitIndex(null);
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const advance = useCallback(
    (nextIndex) => {
      if (itemCount <= 1) return;

      setExitIndex(activeIndexRef.current);
      setActiveIndex(nextIndex);

      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }

      exitTimeoutRef.current = window.setTimeout(() => {
        setExitIndex(null);
        exitTimeoutRef.current = null;
      }, TRANSITION_MS);
    },
    [itemCount]
  );

  const goTo = useCallback(
    (index) => {
      if (index === activeIndexRef.current || itemCount <= 1) return;
      advance(index);
    },
    [advance, itemCount]
  );

  const goToNext = useCallback(() => {
    if (itemCount <= 1) return;
    advance((activeIndexRef.current + 1) % itemCount);
  }, [advance, itemCount]);

  useEffect(() => {
    if (itemCount <= 1 || isPaused || prefersReducedMotion) return undefined;

    const timerId = window.setInterval(goToNext, interval);
    return () => window.clearInterval(timerId);
  }, [goToNext, interval, isPaused, itemCount, prefersReducedMotion]);

  useEffect(() => {
    if (activeIndex >= itemCount) {
      setActiveIndex(0);
      setExitIndex(null);
    }
  }, [activeIndex, itemCount]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return {
    activeIndex,
    exitIndex,
    goTo,
    pause,
    resume,
    prefersReducedMotion,
  };
};

export { TRANSITION_MS };
