import {
  MEASUREMENT_ANSWER_ADD,
  DURATION_ANSWER_ADD,
  MEASUREMENT_TYPE_CHANGE,
  DURATION_TYPE_CHANGE
} from "./actions";

import { merge, get } from "lodash";
import {
  MEASUREMENT,
  TIME,
  measurements,
  duration
} from "constants/answer-types";

const initialState = {};

const measurementUnit = key => {
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

const durationUnit = key => {
  // const { label } = get(duration, key);

  // return {
  //   label,
  //   key
  // };

  const [name, type] = key.split("-");
  const unitType = get(duration, name).types;
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
  // console.log(type, payload);

  switch (type) {
    case MEASUREMENT_ANSWER_ADD: {
      return merge({}, state, {
        [payload.answerId]: {
          unitType: payload.type,
          unit: measurementUnit("Length-cm", payload.type)
        }
      });
    }

    case MEASUREMENT_TYPE_CHANGE: {
      return merge({}, state, {
        [payload.answerId]: { unit: measurementUnit(payload.type) }
      });
    }

    case DURATION_ANSWER_ADD: {
      return merge({}, state, {
        [payload.answerId]: {
          unitType: payload.type,
          unit: durationUnit("years", payload.type)
        }
      });
    }

    case DURATION_TYPE_CHANGE: {
      return merge({}, state, {
        [payload.answerId]: { unit: durationUnit(payload.type) }
      });
    }

    default:
      return state;
  }
};
