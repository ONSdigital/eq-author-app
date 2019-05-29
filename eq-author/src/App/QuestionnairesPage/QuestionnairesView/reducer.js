import { chunk, clamp, sortBy, reverse, get } from "lodash";
import { SORT_ORDER } from "./constants";

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

export const sortQuestionnaires = state => {
  const sortedQuestionnaires = sortBy(state.questionnaires, questionnaire =>
    get(questionnaire, state.currentSortColumn).toUpperCase()
  );
  if (state.currentSortOrder === SORT_ORDER.ASCENDING) {
    return sortedQuestionnaires;
  }
  return reverse(sortedQuestionnaires);
};

const buildState = state => {
  const sortedQuestionnaires = sortQuestionnaires(state);
  const pages = chunk(sortedQuestionnaires, PAGE_SIZE);
  const currentPageIndex = clamp(state.currentPageIndex, 0, pages.length - 1);
  return {
    ...state,
    pages,
    currentPageIndex,
    currentPage: pages[currentPageIndex],
  };
};

export const buildInitialState = questionnaires => state =>
  buildState({ ...state, questionnaires });

export const ACTIONS = {
  CHANGE_PAGE: "CHANGE_PAGE",
  SET_QUESTIONNAIRES: "SET_QUESTIONNAIRES",
  DELETE_QUESTIONNAIRE: "DELETE_QUESTIONNAIRE",
  SORT_COLUMN: "SORT_COLUMN",
  REVERSE_SORT: "REVERSE_SORT",
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
      return buildState({
        ...state,
        questionnaires: action.payload,
      });
    case ACTIONS.DELETE_QUESTIONNAIRE:
      return {
        ...state,
        autoFocusId: calculateAutoFocusId(
          sortQuestionnaires(state),
          action.payload
        ),
      };
    case ACTIONS.SORT_COLUMN:
      return buildState({
        ...state,
        autoFocusId: null,
        currentSortColumn: action.payload,
        currentSortOrder: SORT_ORDER.ASCENDING,
      });
    case ACTIONS.REVERSE_SORT:
      return buildState({
        ...state,
        autoFocusId: null,
        currentSortOrder: action.payload,
      });
    default:
      return state;
  }
};

export default reducer;
