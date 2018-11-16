export const FORMAT_CHANGE = "FORMAT_CHANGE";
export const TYPE_CHANGE = "TYPE_CHANGE";

export const changeType = (answerId, type) => ({
  type: TYPE_CHANGE,
  payload: {
    answerId,
    type
  }
});

export const changeFormat = (answerId, format) => ({
  type: FORMAT_CHANGE,
  payload: {
    answerId,
    format
  }
});
