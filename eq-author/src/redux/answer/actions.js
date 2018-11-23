export const MEASUREMENT_ANSWER_ADD = "MEASUREMENT_ANSWER_ADD";
export const DURATION_ANSWER_ADD = "DURATION_ANSWER_ADD";
export const MEASUREMENT_TYPE_CHANGE = "MEASUREMENT_TYPE_CHANGE";
export const DURATION_TYPE_CHANGE = "DURATION_TYPE_CHANGE";

export const changeMeasurementType = (answerId, type) => ({
  type: MEASUREMENT_TYPE_CHANGE,
  payload: {
    answerId,
    type
  }
});

export const changeDurationType = (answerId, type) => ({
  type: DURATION_TYPE_CHANGE,
  payload: {
    answerId,
    type
  }
});

export const addMeasurementAnswer = (answerId, type) => ({
  type: MEASUREMENT_ANSWER_ADD,
  payload: {
    answerId,
    type
  }
});

export const addDurationAnswer = (answerId, type) => ({
  type: DURATION_ANSWER_ADD,
  payload: {
    answerId,
    type
  }
});
