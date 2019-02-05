export const TOAST_RAISE = "TOAST_RAISE";
export const TOAST_DISMISS = "TOAST_DISMISS";

export const raiseToast = (id, message, context) => {
  return {
    payload: {
      id,
      message,
      context,
    },
    type: TOAST_RAISE,
  };
};

export const dismissToast = id => {
  return {
    payload: {
      id,
    },
    type: TOAST_DISMISS,
  };
};
