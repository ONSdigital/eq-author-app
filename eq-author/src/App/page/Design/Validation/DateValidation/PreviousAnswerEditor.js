import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import PreviousAnswerContentPicker from "../PreviousAnswerContentPicker";

const PreviousAnswerEditor = ({ onChangeUpdate, answer, validation, readKey, }) => (
  <PreviousAnswerContentPicker
    answerId={answer.id}
    onSubmit={onChangeUpdate}
    selectedContentDisplayName={get(validation.previousAnswer, "displayName")}
    selectedId={get(validation.previousAnswer, "id")}
    path={`answer.validation.${readKey}.availablePreviousAnswers`}
    data-test="content-picker-select"
  />
);

PreviousAnswerEditor.propTypes = {
  validation: PropTypes.shape({
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  readKey: PropTypes.string.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default PreviousAnswerEditor;
