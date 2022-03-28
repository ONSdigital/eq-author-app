import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { isEmpty } from "lodash";

import NoResults from "./NoResults";
import QuestionnairesTable from "./QuestionnairesTable";
import Header from "./Header";
import PaginationNav from "./PaginationNav";

import reducer, { buildInitialState, ACTIONS } from "./reducer";
import { SORT_ORDER } from "constants/sort-order";
import usePersistedReducer from "./usePersistedReducer";
import NoResultsFiltered from "./NoResultsFiltered";

export const STORAGE_KEY = "questionnaire-list-settings";

const STORED_KEYS = [
  "currentPageIndex",
  "currentSortColumn",
  "currentSortOrder",
  "searchTerm",
  "isFiltered",
];

const QuestionnairesView = ({
  questionnaires,
  selectedQuestionnaire,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  onCreateQuestionnaire,
  canCreateQuestionnaire,
  enabledHeadings,
  onQuestionnaireClick,
  padding,
  variant,
  questionnaireModal,
}) => {
  const questionnairesRef = useRef(questionnaires);

  const [state, dispatch] = usePersistedReducer(
    STORAGE_KEY,
    STORED_KEYS,
    reducer,
    {
      currentPageIndex: 0,
      currentSortColumn: "createdAt",
      currentSortOrder: SORT_ORDER.DESCENDING,
      searchTerm: "",
      isFiltered: true,
    },
    buildInitialState(questionnairesRef.current)
  );

  if (questionnaires !== questionnairesRef.current) {
    dispatch({
      type: ACTIONS.SET_QUESTIONNAIRES,
      payload: questionnaires,
    });
    questionnairesRef.current = questionnaires;
  }

  const handleDeleteQuestionnaire = (questionnaire) => {
    dispatch({
      type: ACTIONS.DELETE_QUESTIONNAIRE,
      payload: questionnaire,
    });
    onDeleteQuestionnaire(questionnaire.id);
  };

  const handleSortQuestionnaires = (sortColumn) => {
    dispatch({
      type: ACTIONS.SORT_COLUMN,
      payload: sortColumn,
    });
  };

  const handleReverseSort = () => {
    const inversion = {
      ascending: SORT_ORDER.DESCENDING,
      descending: SORT_ORDER.ASCENDING,
    };
    dispatch({
      type: ACTIONS.REVERSE_SORT,
      payload: inversion[state.currentSortOrder],
    });
  };

  const onToggleFilter = (isFiltered) =>
    dispatch({
      type: ACTIONS.TOGGLE_FILTER,
      payload: { isFiltered },
    });

  const onSearchChange = useCallback(
    (searchTerm) => dispatch({ type: ACTIONS.SEARCH, payload: searchTerm }),
    [dispatch]
  );

  if (isEmpty(state.apiQuestionnaires)) {
    return <NoResults onCreateQuestionnaire={onCreateQuestionnaire} />;
  }

  return (
    <>
      <Header
        onCreateQuestionnaire={onCreateQuestionnaire}
        onSearchChange={onSearchChange}
        isFiltered={state.isFiltered}
        onToggleFilter={onToggleFilter}
        canCreateQuestionnaire={canCreateQuestionnaire}
        padding={padding}
      />
      {isEmpty(state.questionnaires) && (
        <NoResultsFiltered
          searchTerm={state.searchTerm}
          isFiltered={state.isFiltered}
        />
      )}
      {!isEmpty(state.questionnaires) && (
        <QuestionnairesTable
          questionnaires={state.currentPage}
          selectedQuestionnaire={selectedQuestionnaire}
          onDeleteQuestionnaire={handleDeleteQuestionnaire}
          onDuplicateQuestionnaire={onDuplicateQuestionnaire}
          onSortQuestionnaires={handleSortQuestionnaires}
          onReverseSort={handleReverseSort}
          sortColumn={state.currentSortColumn}
          sortOrder={state.currentSortOrder}
          autoFocusId={state.autoFocusId}
          enabledHeadings={enabledHeadings}
          onQuestionnaireClick={onQuestionnaireClick}
          questionnaireModal={questionnaireModal}
          variant={variant}
        />
      )}
      <PaginationNav
        countOnPage={state.currentPage ? state.currentPage.length : 0}
        totalCount={state.questionnaires.length}
        pageCount={state.pages.length}
        currentPageIndex={state.currentPageIndex}
        onPageChange={(newPage) =>
          dispatch({ type: ACTIONS.CHANGE_PAGE, payload: newPage })
        }
        padding={padding}
      />
    </>
  );
};

QuestionnairesView.propTypes = {
  questionnaires: PropTypes.arrayOf(
    propType(QuestionnairesTable.fragments.QuestionnaireDetails)
  ),
  questionnaireModal: PropTypes.bool,
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func,
  canCreateQuestionnaire: PropTypes.bool,
  enabledHeadings: PropTypes.array.isRequired, // eslint-disable-line
  onQuestionnaireClick: PropTypes.func,
  padding: PropTypes.string,
  selectedQuestionnaire: PropTypes.object, // eslint-disable-line
  variant: PropTypes.string,
};

export default QuestionnairesView;
