import { TOAST_DISMISS, TOAST_RAISE } from "redux/toast/actions";
import { omit } from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case TOAST_RAISE: {
      return {
        ...state,
        [action.payload.id]: {
          message: action.payload.message,
          undoAction: action.payload.undoAction,
          context: action.payload.context
        }
      };
    }
    case TOAST_DISMISS: {
      return omit(state, action.payload.id);
    }
    default:
      return state;
  }
};
