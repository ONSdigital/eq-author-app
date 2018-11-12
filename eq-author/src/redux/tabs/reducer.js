import { TAB_GOTO } from "./actions";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case TAB_GOTO: {
      return {
        ...state,
        [payload.tabsId]: payload.activeTabId
      };
    }

    default:
      return state;
  }
};
