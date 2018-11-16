import { TYPE_CHANGE } from "./actions";

import { merge, get } from "lodash";
import { units } from "constants/answer-types";

const initialState = {};

const unit = key => {
  const [name, type] = key.split("-");
  const unitType = get(units, name).types;
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
  switch (type) {
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
  if (answerType !== "Number") {
    return state.answer[answerId];
  }

  return {
    unit: unit("Number-number"),
    ...state.answer[answerId]
  };
};
