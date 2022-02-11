import React from "react";
import PropTypes from "prop-types";
import Row from "components-themed/questionnaireTable/row.js";

const TableBody = ({ questionnaires, enabledHeadings }) => (
  <tbody>
    {questionnaires.map(({ id }, index) => (
      <Row
        key={id}
        questionnaire={questionnaires[index]}
        data-test="questionnaire-row"
        tableHeadings={enabledHeadings}
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
  enabledHeadings: PropTypes.array, // eslint-disable-line
  onRowClick: PropTypes.func,
  questionnaireModal: PropTypes.bool,
  selectedQuestionnaire: PropTypes.object, // eslint-disable-line
};

export default TableBody;
