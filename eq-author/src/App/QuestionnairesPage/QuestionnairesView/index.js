import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { isEmpty } from "lodash";
import CustomPropTypes from "custom-prop-types";

import NoResults from "./NoResults";
import QuestionnairesTable from "./QuestionnairesTable";
import Header from "./Header";
import Footer from "./Footer";

import reducer, { buildInitialState, ACTIONS } from "./reducer";
import { SORT_ORDER } from "./constants";
import usePersistedReducer from "./usePersistedReducer";
import NoResultsFiltered from "./NoResultsFiltered";

export const STORAGE_KEY = "questionnaire-list-settings";

const STORED_KEYS = [
  "currentPageIndex",
  "currentSortColumn",
  "currentSortOrder",
  "searchTerm",
  "hideUnowned",
];

const QuestionnairesView = ({
  questionnaires,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  onCreateQuestionnaire,
  currentUser,
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
      hideUnowned: true,
    },
    buildInitialState(questionnairesRef.current, currentUser)
  );

  if (questionnaires !== questionnairesRef.current) {
    dispatch({
      type: ACTIONS.SET_QUESTIONNAIRES,
      payload: questionnaires,
    });
    questionnairesRef.current = questionnaires;
  }

  const handleDeleteQuestionnaire = questionnaire => {
    dispatch({
      type: ACTIONS.DELETE_QUESTIONNAIRE,
      payload: questionnaire,
    });
    onDeleteQuestionnaire(questionnaire.id);
  };

  const handleSortQuestionnaires = sortColumn => {
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

  const onToggleHideUnowned = currentUser => hideUnowned =>
    dispatch({
      type: ACTIONS.TOGGLE_HIDE_UNOWNED,
      payload: { hideUnowned, currentUser },
    });

  if (isEmpty(state.apiQuestionnaires)) {
    return <NoResults onCreateQuestionnaire={onCreateQuestionnaire} />;
  }

  const onSearchChange = useCallback(
    searchTerm => dispatch({ type: ACTIONS.SEARCH, payload: searchTerm }),
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
        searchTerm={state.searchTerm}
        hideUnowned={state.hideUnowned}
        onToggleHideUnowned={onToggleHideUnowned(currentUser)}
      />
      {isEmpty(state.questionnaires) ? (
        <NoResultsFiltered
          searchTerm={state.searchTerm}
          hideUnowned={state.hideUnowned}
        />
      ) : (
        <QuestionnairesTable
          questionnaires={state.currentPage}
          onDeleteQuestionnaire={handleDeleteQuestionnaire}
          onDuplicateQuestionnaire={onDuplicateQuestionnaire}
          onSortQuestionnaires={handleSortQuestionnaires}
          onReverseSort={handleReverseSort}
          sortColumn={state.currentSortColumn}
          sortOrder={state.currentSortOrder}
          autoFocusId={state.autoFocusId}
        />
      )}

      <Footer
        countOnPage={state.currentPage ? state.currentPage.length : 0}
        totalCount={state.questionnaires.length}
        pageCount={state.pages.length}
        currentPageIndex={state.currentPageIndex}
        onPageChange={newPage =>
          dispatch({ type: ACTIONS.CHANGE_PAGE, payload: newPage })
        }
      />
    </>
  );
};

QuestionnairesView.propTypes = {
  questionnaires: PropTypes.arrayOf(
    propType(QuestionnairesTable.fragments.QuestionnaireDetails)
  ),
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
  currentUser: CustomPropTypes.user.isRequired,
};

export default QuestionnairesView;
