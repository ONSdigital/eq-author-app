import { chunk, clamp } from "lodash";

const PAGE_SIZE = 16;

const calculateAutoFocusId = (questionnaires, deletedQuestionnaire) => {
  const possibleNextIndex =
    questionnaires.indexOf(
      questionnaires.find(q => q.id === deletedQuestionnaire.id)
    ) + 1;

  // If the last one is being removed then focus the one before that
  const nextIndex =
    possibleNextIndex > questionnaires.length - 1
      ? questionnaires.length - 2
      : possibleNextIndex;

  // We have to set focusedId to undefined when there are no
  // questionnaires left
  return (questionnaires[nextIndex] || {}).id;
};

export const buildInitialState = questionnaires => state => {
  const pages = chunk(questionnaires, PAGE_SIZE);
  const currentPageIndex = clamp(state.currentPageIndex, 0, pages.length - 1);
  return {
    ...state,
    questionnaires,
    pages,
    currentPageIndex,
    currentPage: pages[currentPageIndex],
  };
};

export const ACTIONS = {
  CHANGE_PAGE: "CHANGE_PAGE",
  SET_QUESTIONNAIRES: "SET_QUESTIONNAIRES",
  DELETE_QUESTIONNAIRE: "DELETE_QUESTIONNAIRE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_PAGE: {
      const currentPageIndex = clamp(action.payload, 0, state.pages.length - 1);
      return {
        ...state,
        currentPageIndex,
        currentPage: state.pages[currentPageIndex],
        autoFocusId: null,
      };
    }
    case ACTIONS.SET_QUESTIONNAIRES:
      return buildInitialState(action.payload)(state);
    case ACTIONS.DELETE_QUESTIONNAIRE:
      return {
        ...state,
        autoFocusId: calculateAutoFocusId(state.questionnaires, action.payload),
      };
    default:
      return state;
  }
};

export default reducer;
