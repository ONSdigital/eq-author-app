import { TYPE_CHANGE, ANSWER_ADD } from "./actions";

import { merge, get } from "lodash";
import { measurements, MEASUREMENT } from "constants/answer-types";

const initialState = {};

const unit = key => {
  const [name, type] = key.split("-");
  const unitType = get(measurements, name).types;
  const { char, label } = get(unitType, type);

  return {
    key,
    name,
    type,
    char,
    label
  };
};

export default (state = initialState, { type, payload }) => {
  console.log(type, payload);

  switch (type) {
    case ANSWER_ADD: {
      return merge({}, state, {
        [payload.answerId]: { unitType: payload.type, unit: unit("Length-cm") }
      });
    }
    case TYPE_CHANGE: {
      return merge({}, state, {
        [payload.answerId]: { unit: unit(payload.type) }
      });
    }

    default:
      return state;
  }
};

export const getUnit = (state, answerId, answerType) => {
  if (answerType !== MEASUREMENT) {
    return state.answer[answerId];
  }

  return {
    unit: unit("Length-cm"),
    ...state.answer[answerId]
  };
};
