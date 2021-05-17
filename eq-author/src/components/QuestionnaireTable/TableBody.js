import React from "react";
import PropTypes from "prop-types";
import Row from "./Row";

const TableBody = ({
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  enabledHeadings,
  onRowClick,
}) => (
  <tbody>
    {questionnaires.map(({ id }, index) => (
      <Row
        key={id}
        autoFocus={id === autoFocusId}
        questionnaire={questionnaires[index]}
        onDeleteQuestionnaire={onDeleteQuestionnaire}
        onDuplicateQuestionnaire={onDuplicateQuestionnaire}
        onLockQuestionnaire={handleLock}
        isLastOnPage={questionnaires.length === index + 1}
        data-test="questionnaire-row"
        tableHeadings={enabledHeadings}
        onClick={onRowClick}
      />
    ))}
  </tbody>
);

TableBody.propTypes = {
  questionnaires: PropTypes.array, // eslint-disable-line
  autoFocusId: PropTypes.string,
  onDeleteQuestionnaire: PropTypes.func,
  onDuplicateQuestionnaire: PropTypes.func,
  handleLock: PropTypes.func,
  clickable: PropTypes.bool,
};

export default TableBody;
