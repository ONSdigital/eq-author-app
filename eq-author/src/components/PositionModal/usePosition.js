import { useEffect, useRef, useState } from "react";

export const usePosition = ({ options, selected }) => {
  const [state, setState] = useState({ position: null, item: null });
  const previousPosition = useRef(null);

  useEffect(() => {
    const findPrevious = options.findIndex(({ id }) => id === selected?.id);
    previousPosition.current = findPrevious > -1 ? findPrevious : 0;
    setState({
      position: previousPosition.current,
      item: options[previousPosition.current],
    });
  }, [options, selected]);

  return [state, previousPosition.current, setState];
};
