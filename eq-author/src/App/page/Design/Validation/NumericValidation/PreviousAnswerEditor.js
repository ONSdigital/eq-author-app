import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import FieldWithInclude from "../FieldWithInclude";
import * as entityTypes from "constants/validation-entity-types";
import PreviousAnswerContentPicker from "../PreviousAnswerContentPicker";

const PreviousAnswerEditor = ({ onChangeUpdate, answer, validation, readKey, }) => (

  <FieldWithInclude
    id="inclusive"
    name="inclusive"
    onChange={onChangeUpdate}
    checked={validation.inclusive}
  >
    <PreviousAnswerContentPicker
      answerId={answer.id}
      onSubmit={onChangeUpdate}
      selectedContentDisplayName={get(validation.previousAnswer, "displayName")}
      selectedId={get(validation.previousAnswer, "id")}
      path={`answer.validation.${readKey}.availablePreviousAnswers`}
      data-test="content-picker-select"
    />
  </FieldWithInclude>
);
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
    type: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }),
    validationErrorInfo: PropTypes.shape({
      errors: PropTypes.arrayOf(
        PropTypes.shape({
          errorCode: PropTypes.string,
          field: PropTypes.string,
          id: PropTypes.string,
          type: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  readKey: PropTypes.string.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default PreviousAnswerEditor;
