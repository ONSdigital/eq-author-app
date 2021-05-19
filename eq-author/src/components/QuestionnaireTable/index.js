import React, { useRef } from "react";

import styled from "styled-components";
import PropTypes from "prop-types";

import TableHead from "./TableHead";
import TableBody from "./TableBody";

import reducer, { buildInitialState, ACTIONS } from "./reducer";
import usePersistedReducer from "./usePersistedReducer";

import { SORT_ORDER } from "constants/sort-order";

const TableWrapper = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

export const STORAGE_KEY = "questionnaire-list-settings";

const STORED_KEYS = [
  "currentPageIndex",
  "currentSortColumn",
  "currentSortOrder",
  "searchTerm",
  "isFiltered",
];

const QuestionnaireTable = ({
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  enabledHeadings,
  clickable,
  onRowClick,
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

  return (
    <TableWrapper>
      <TableHead
        onSortClick={(sortColumn) => handleSortQuestionnaires(sortColumn)}
        onReverseClick={handleReverseSort}
        sortOrder={state.currentSortOrder}
        currentSortColumn={state.currentSortColumn}
        enabledHeadings={enabledHeadings}
      />
      <TableBody
        questionnaires={state.currentPage}
        autoFocusId={autoFocusId}
        onDeleteQuestionnaire={onDeleteQuestionnaire}
        onDuplicateQuestionnaire={onDuplicateQuestionnaire}
        handleLock={handleLock}
        clickable={clickable}
        enabledHeadings={enabledHeadings}
        onRowClick={onRowClick}
      />
    </TableWrapper>
  );
};

QuestionnaireTable.propTypes = {
  onSortClick: PropTypes.func,
  onReverseClick: PropTypes.func,
  sortOrder: PropTypes.string,
  currentSortColumn: PropTypes.string,
  tableHeadings: PropTypes.array.isRequired, // eslint-disable-line
  questionnaires: PropTypes.array, // eslint-disable-line
  autoFocusId: PropTypes.string,
  onDeleteQuestionnaire: PropTypes.func,
  onDuplicateQuestionnaire: PropTypes.func,
  handleLock: PropTypes.func,
  enabledHeadings: PropTypes.array, // eslint-disable-line
  clickable: PropTypes.bool,
  onRowClick: PropTypes.func.isRequired,
};

QuestionnaireTable.defaultProps = {
  clickable: true,
};

export default QuestionnaireTable;
