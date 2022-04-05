import { useMemo, useReducer, useEffect } from "react";
import { pick } from "lodash";

export default (
  storageKey,
  storedKeys,
  reducer,
  defaultState,
  initialStateBuilder
) => {
  // Load previous values once
  const storedState = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey));
    } catch (e) {
      return null;
    }
  }, [storageKey]);
  const [state, dispatch] = useReducer(
    reducer,
    { ...defaultState, ...(storedState || {}) },
    initialStateBuilder
  );
  // Save if any of the stored values change
  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(pick(state, storedKeys))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(pick(state, storedKeys)));
  return [state, dispatch];
};
