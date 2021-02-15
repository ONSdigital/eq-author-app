import { get } from "lodash";
import {
  START_REQUEST,
  END_REQUEST,
  LOST_CONNECTION,
  GAIN_CONNECTION,
  API_DOWN_ERROR,
} from "redux/saving/actions";

const initialState = {
  pendingRequestCount: 0,
  offline: false,
  apiDownError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOST_CONNECTION: {
      return {
        ...state,
        offline: true,
      };
    }
    case GAIN_CONNECTION: {
      return {
        ...state,
        offline: false,
      };
    }
    case START_REQUEST: {
      return {
        ...state,
        pendingRequestCount: state.pendingRequestCount + 1,
      };
    }
    case END_REQUEST: {
      return {
        ...state,
        pendingRequestCount: Math.max(0, state.pendingRequestCount - 1),
      };
    }
    case API_DOWN_ERROR: {
      return {
        ...state,
        apiDownError: true,
      };
    }
    default:
      return state;
  }
};

export const isSaving = (state) => get(state, "saving.pendingRequestCount") > 0;
export const isOffline = (state) => get(state, "saving.offline");
export const hasApiError = (state) => get(state, "saving.apiDownError");
export const hasError = (state) => isOffline(state) || hasApiError(state);
