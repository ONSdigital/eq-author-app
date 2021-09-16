import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import { ERR_NO_VALUE } from "constants/validationMessages";

import ValidationError from "components/ValidationError";
import MetadataContentPicker from "../MetadataContentPicker.js";

const MetadataEditor = ({ onChangeUpdate, answer, validation }) => (
  <>
    <MetadataContentPicker
      answerId={answer.id}
      onSubmit={onChangeUpdate}
      selectedContentDisplayName={get(validation.previousAnswer, "displayName")}
      selectedMetadataDisplayName={get(validation.metadata, "displayName")}
      selectedId={get(validation.previousAnswer, "id")}
    />
    {validation.validationErrorInfo.errors.some(
      (error) => error.errorCode === "ERR_NO_VALUE"
    ) && <ValidationError>{ERR_NO_VALUE}</ValidationError>}
  </>
);

MetadataEditor.propTypes = {
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default MetadataEditor;
