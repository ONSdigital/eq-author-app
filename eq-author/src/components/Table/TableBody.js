import React from "react";
import PropTypes from "prop-types";

import Row from "./Row";

const listQuestionnaires = (
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock
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
    />
  ));

const TableBody = ({
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
}) => {
  return (
    <tbody>
      {listQuestionnaires(
        questionnaires,
        autoFocusId,
        onDeleteQuestionnaire,
        onDuplicateQuestionnaire,
        handleLock
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
};

export default TableBody;
