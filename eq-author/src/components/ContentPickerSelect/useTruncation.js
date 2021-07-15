import { useCallback, useRef, useState, useEffect } from "react";
import { throttle } from "lodash";

export const useTruncation = () => {
  const [isTruncated, setIsTruncated] = useState(false);
  const elementToTruncate = useRef(null);

  const checkTruncation = useCallback(() => {
    if (elementToTruncate.current) {
      if (
        elementToTruncate.current.offsetWidth <
        elementToTruncate.current.scrollWidth
      ) {
        setIsTruncated(true);
      } else {
        setIsTruncated(false);
      }
    }
  }, []);

  useEffect(() => {
    checkTruncation();
  }, [checkTruncation]);

  useEffect(() => {
    const resizeListener = throttle(() => {
      checkTruncation();
    }, 750);
    window.addEventListener("resize", resizeListener);

    return () => window.removeEventListener("resize", resizeListener);
  });

  return [isTruncated, elementToTruncate];
};
