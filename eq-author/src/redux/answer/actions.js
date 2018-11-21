export const ANSWER_ADD = "ANSWER_ADD";
export const TYPE_CHANGE = "TYPE_CHANGE";

export const changeType = (answerId, type) => ({
  type: TYPE_CHANGE,
  payload: {
    answerId,
    type
  }
});

export const addAnswer = (answerId, type) => ({
  type: ANSWER_ADD,
  payload: {
    answerId,
    type
  }
});
