import { useEffect, useRef } from 'react';

export const useScrollToBottom = (dependency: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - clientHeight - containerRef.current.scrollTop < 100;
      
      if (isNearBottom) {
        containerRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [dependency]);

  return containerRef;
};