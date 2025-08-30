import { useEffect } from 'react';

type Handlers = {
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onBackspace?: () => void;
};

export function useKeyboardNav(handlers: Handlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlers.onLeft?.();
      } else if (e.key === 'ArrowRight') {
        handlers.onRight?.();
      } else if (e.key === 'Enter') {
        handlers.onEnter?.();
      } else if (e.key === 'Backspace') {
        handlers.onBackspace?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers.onLeft, handlers.onRight, handlers.onEnter, handlers.onBackspace]);
}
