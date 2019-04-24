import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import { Field } from "components/Forms";

import { UnwrappedPreviousAnswerContentPicker as PreviousAnswerContentPicker } from "../../../PreviousAnswerContentPicker";

const PreviousAnswerEditor = ({ total, onChangeUpdate }) => (
  <Field>
    <PreviousAnswerContentPicker
      onSubmit={onChangeUpdate}
      selectedContentDisplayName={get(total.previousAnswer, "displayName")}
      data={total}
      path="availablePreviousAnswers"
      data-test="content-picker-select"
    />
  </Field>
);
PreviousAnswerEditor.propTypes = {
  total: PropTypes.shape({
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default PreviousAnswerEditor;
