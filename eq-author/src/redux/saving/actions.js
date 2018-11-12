export const START_REQUEST = "START_REQUEST";
export const END_REQUEST = "END_REQUEST";
export const LOST_CONNECTION = "LOST_CONNECTION";
export const GAIN_CONNECTION = "GAIN_CONNECTION";
export const API_DOWN_ERROR = "API_DOWN_ERROR";

export const startRequest = () => ({
  type: START_REQUEST
});

export const endRequest = () => ({
  type: END_REQUEST
});

export const lostConnection = () => ({
  type: LOST_CONNECTION
});

export const gainConnection = () => ({
  type: GAIN_CONNECTION
});

export const apiDownError = () => ({
  type: API_DOWN_ERROR
});
