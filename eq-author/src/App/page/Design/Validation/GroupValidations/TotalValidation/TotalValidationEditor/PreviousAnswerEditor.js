import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import { Field } from "components/Forms";
import ValidationError from "components/ValidationError";

import {
  ERR_REFERENCE_DELETED,
  ERR_REFERENCE_MOVED,
} from "constants/validationMessages";

import { UnwrappedPreviousAnswerContentPicker as PreviousAnswerContentPicker } from "../../../PreviousAnswerContentPicker";

export const errorMessages = {
  ERR_NO_VALUE: "Answer required",
  ERR_REFERENCE_DELETED,
  ERR_REFERENCE_MOVED,
};

const PreviousAnswerEditor = ({ total, onChangeUpdate, errors }) => {
  const error = errors?.[0];

  return (
    <Field>
      <PreviousAnswerContentPicker
        onSubmit={onChangeUpdate}
        selectedContentDisplayName={get(total.previousAnswer, "displayName")}
        data-test="content-picker-select"
        hasError={Boolean(error)}
      />
      {error && (
        <ValidationError right={false}>
          {errorMessages[error.errorCode]}
        </ValidationError>
      )}
    </Field>
  );
};

PreviousAnswerEditor.propTypes = {
  total: PropTypes.shape({
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      errorCode: PropTypes.string,
      field: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string,
    })
  ),
};

export default PreviousAnswerEditor;
