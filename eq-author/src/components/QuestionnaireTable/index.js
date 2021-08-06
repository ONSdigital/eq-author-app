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

  ${({ variant }) =>
    variant === "selectModal" &&
    `
    height: 17em;
    overflow-y: scroll;
    display: block;
  `}
`;

const QuestionnaireTable = ({
  onSortClick,
  onReverseClick,
  sortOrder,
  currentSortColumn,
  questionnaires,
  selectedQuestionnaire,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  enabledHeadings,
  clickable,
  onRowClick,
  questionnaireModal,
  variant,
}) => {
  return (
    <TableWrapper variant={variant}>
      <TableHead
        onSortClick={onSortClick}
        onReverseClick={onReverseClick}
        sortOrder={sortOrder}
        currentSortColumn={currentSortColumn}
        enabledHeadings={enabledHeadings}
        sticky={variant === "selectModal"}
      />
      <TableBody
        questionnaires={questionnaires}
        selectedQuestionnaire={selectedQuestionnaire}
        autoFocusId={autoFocusId}
        onDeleteQuestionnaire={onDeleteQuestionnaire}
        onDuplicateQuestionnaire={onDuplicateQuestionnaire}
        handleLock={handleLock}
        clickable={clickable}
        enabledHeadings={enabledHeadings}
        onRowClick={onRowClick}
        questionnaireModal={questionnaireModal}
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
  questionnaireModal: PropTypes.bool,
  selectedQuestionnaire: PropTypes.object, // eslint-disable-line
  variant: PropTypes.string,
};

QuestionnaireTable.defaultProps = {
  clickable: true,
};

export default QuestionnaireTable;
