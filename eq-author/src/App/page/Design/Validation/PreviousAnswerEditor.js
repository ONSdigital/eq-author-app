import React from "react";
import PropTypes from "prop-types";
import ValidationError from "components/ValidationError";

import FieldWithInclude from "./FieldWithInclude";
import * as entityTypes from "constants/validation-entity-types";
import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";

import {
  ERR_REFERENCE_DELETED,
  ERR_REFERENCE_MOVED,
} from "constants/validationMessages";

export const errorMessages = {
  ERR_NO_VALUE: "Answer required",
  ERR_REFERENCE_DELETED,
  ERR_REFERENCE_MOVED,
};

const PreviousAnswerEditor = ({
  onChangeUpdate,
  answer,
  validation,
  readKey,
}) => {
  const { errors } = validation.validationErrorInfo;

  const errorCode = errors
    .map((e) => e.errorCode)
    .find((errorCode) => Object.keys(errorMessages).includes(errorCode));

  const contentPicker = (
    <PreviousAnswerContentPicker
      answerId={answer.id}
      onSubmit={onChangeUpdate}
      selectedContentDisplayName={validation?.previousAnswer?.displayName}
      selectedId={validation?.previousAnswer?.id}
      path={`answer.validation.${readKey}.availablePreviousAnswers`}
      data-test="content-picker-select"
      hasError={Boolean(errorCode)}
    />
  );

  const component = validation?.__typename?.includes("Date") ? (
    contentPicker
  ) : (
    <FieldWithInclude
      id="inclusive"
      name="inclusive"
      onChange={onChangeUpdate}
      checked={validation.inclusive}
    >
      {contentPicker}
    </FieldWithInclude>
  );

  return (
    <>
      {component}
      {errorCode && (
        <ValidationError right={false}>
          {errorMessages[errorCode]}
        </ValidationError>
      )}
    </>
  );
};

PreviousAnswerEditor.propTypes = {
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    custom: PropTypes.number,
    inclusive: PropTypes.bool.isRequired,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    entityType: PropTypes.oneOf(Object.values(entityTypes)),
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  readKey: PropTypes.string.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default PreviousAnswerEditor;
