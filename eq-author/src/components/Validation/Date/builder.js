import { flowRight, omit } from "lodash/fp";

import withToggleAnswerValidation from "containers/enhancers/withToggleAnswerValidation";
import withUpdateAnswerValidation from "containers/enhancers/withUpdateAnswerValidation";
import withEntityEditor from "components/withEntityEditor";

import withAnswerValidation from "../withAnswerValidation";

import DateValidation from "./DateValidation";
import { withProps, withPropRenamed, withPropRemapped } from "./enhancers";

import {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA
} from "constants/validation-entity-types";

const getCustom = (entityType, customDate) => {
  if (entityType !== CUSTOM || !customDate) {
    return null;
  }
  return customDate;
};

const getPreviousAnswer = (entityType, previousAnswer) => {
  if (entityType !== PREVIOUS_ANSWER || !previousAnswer) {
    return null;
  }
  return previousAnswer.id;
};

const getMetadata = (entityType, metadata) => {
  if (entityType !== METADATA || !metadata) {
    return null;
  }
  return metadata.id;
};

export const readToWriteMapper = outputKey => ({
  id,
  customDate,
  previousAnswer,
  metadata,
  entityType,
  ...rest
}) => ({
  id,
  [outputKey]: {
    ...omit("enabled", rest),
    entityType,
    custom: getCustom(entityType, customDate),
    previousAnswer: getPreviousAnswer(entityType, previousAnswer),
    metadata: getMetadata(entityType, metadata)
  }
});

export default (displayName, testId, readKey, writeKey, fragment) => {
  const withEditing = flowRight(
    withProps({ displayName, testId, readKey }),
    withAnswerValidation(readKey),
    withUpdateAnswerValidation,
    withToggleAnswerValidation,
    withPropRemapped(
      "onUpdateAnswerValidation",
      "onUpdate",
      readToWriteMapper(writeKey)
    ),
    withEntityEditor(readKey, fragment),
    withPropRenamed(readKey, "date")
  );
  return withEditing(DateValidation);
};
