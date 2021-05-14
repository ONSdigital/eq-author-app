import React from "react";
import PropTypes from "prop-types";

import Row from "./Row";
import UnclickableRow from "./UnclickableRow";

import tableHeadings from "./TableHeadings";

const listQuestionnaires = (
  questionnaires,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  tableHeadings,
  clickable
) =>
  clickable
    ? questionnaires.map(({ id }, index) => (
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
      ))
    : questionnaires.map(({ id }, index) => (
        <UnclickableRow
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
  clickable,
}) => {
  return (
    <tbody>
      {listQuestionnaires(
        questionnaires,
        autoFocusId,
        onDeleteQuestionnaire,
        onDuplicateQuestionnaire,
        handleLock,
        tableHeadings,
        clickable
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
  clickable: PropTypes.bool,
};

export default TableBody;
