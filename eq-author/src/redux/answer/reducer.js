import {
  MEASUREMENT_ANSWER_ADD,
  DURATION_ANSWER_ADD,
  MEASUREMENT_TYPE_CHANGE,
  DURATION_TYPE_CHANGE
} from "./actions";

import { merge, get } from "lodash";
import { measurements, duration } from "constants/answer-types";

const initialState = {};

const unit = (key, answerType) => {
  const [name, type] = key.split("-");
  const unitType = get(answerType, name).types;
  const { char, label, msu } = get(unitType, type);

  return {
    key,
    name,
    type,
    char,
    label,
    msu
  };
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case MEASUREMENT_ANSWER_ADD: {
      return merge({}, state, {
        [payload.answerId]: {
          unitType: payload.type,
          unit: unit("Length-cm", measurements)
        }
      });
    }

    case MEASUREMENT_TYPE_CHANGE: {
      return merge({}, state, {
        [payload.answerId]: { unit: unit(payload.type, measurements) }
      });
    }

    case DURATION_ANSWER_ADD: {
      return merge({}, state, {
        [payload.answerId]: {
          unitType: payload.type,
          unit: unit("Years-years", duration)
        }
      });
    }

    case DURATION_TYPE_CHANGE: {
      return merge({}, state, {
        [payload.answerId]: { unit: unit(payload.type, duration) }
      });
    }

    default:
      return state;
  }
};
