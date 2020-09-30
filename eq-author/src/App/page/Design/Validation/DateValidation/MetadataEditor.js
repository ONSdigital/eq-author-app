import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import MetadataContentPicker from "../MetadataContentPicker.js";

const MetadataEditor = ({ onChangeUpdate, answer, validation, readKey }) => (
  <MetadataContentPicker
    answerId={answer.id}
    onSubmit={onChangeUpdate}
    selectedContentDisplayName={get(validation.previousAnswer, "displayName")}
    selectedId={get(validation.previousAnswer, "id")}
    path={`answer.validation.${readKey}.availableMetadata`}
  />
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
  readKey: PropTypes.string.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default MetadataEditor;
