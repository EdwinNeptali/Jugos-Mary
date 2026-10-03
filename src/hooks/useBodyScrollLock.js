import { useLayoutEffect } from 'react';

let activeLocks = 0;
let savedScrollY = 0;

/**
 * Locks page scroll/touch while `isLocked` is true, restoring the exact
 * scroll position on unlock. Counter is module-level so overlapping
 * locks (cart closing while checkout opens in the same tick) don't
 * unlock prematurely.
 */
export default function useBodyScrollLock(isLocked) {
  useLayoutEffect(() => {
    if (!isLocked) return;

    const { body, documentElement: html } = document;

    if (activeLocks === 0) {
      savedScrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${savedScrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      html.style.overflow = 'hidden';
      body.classList.add('body-scroll-locked');
    }
    activeLocks += 1;

    return () => {
      activeLocks -= 1;
      if (activeLocks === 0) {
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        html.style.overflow = '';
        body.classList.remove('body-scroll-locked');
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [isLocked]);
}
