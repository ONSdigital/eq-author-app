import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TableHead from "./TableHead";
import TableBody from "./TableBody";

const TableWrapper = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

const QuestionnaireTable = ({
  onSortClick,
  onReverseClick,
  sortOrder,
  currentSortColumn,
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  enabledHeadings,
  clickable,
  onRowClick,
}) => {
  return (
    <TableWrapper>
      <TableHead
        onSortClick={onSortClick}
        onReverseClick={onReverseClick}
        sortOrder={sortOrder}
        currentSortColumn={currentSortColumn}
        enabledHeadings={enabledHeadings}
      />
      <TableBody
        questionnaires={questionnaires}
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
