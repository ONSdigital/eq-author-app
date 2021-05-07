import React from "react";
import PropTypes from "prop-types";

import Row from "./Row";

const listQuestionnaires = (
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  tableHeadings
) =>
  questionnaires.map(({ id }, index) => (
    <Row
      key={id}
      autoFocus={id === autoFocusId}
      questionnaire={questionnaires[index]}
      onDeleteQuestionnaire={onDeleteQuestionnaire}
      onDuplicateQuestionnaire={onDuplicateQuestionnaire}
      onLockQuestionnaire={handleLock}
      isLastOnPage={questionnaires.length === index + 1}
      data-test="questionnaire-row"
      tableHeadings={tableHeadings}
    />
  ));

const TableBody = ({
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  tableHeadings,
}) => {
  return (
    <tbody>
      {listQuestionnaires(
        questionnaires,
        autoFocusId,
        onDeleteQuestionnaire,
        onDuplicateQuestionnaire,
        handleLock,
        tableHeadings
      )}
    </tbody>
  );
};

TableBody.propTypes = {
  questionnaires: PropTypes.array, // eslint-disable-line
  autoFocusId: PropTypes.string,
  onDeleteQuestionnaire: PropTypes.func,
  onDuplicateQuestionnaire: PropTypes.func,
  handleLock: PropTypes.func,
  tableHeadings: PropTypes.array, // eslint-disable-line
};

export default TableBody;
