import { omit } from "lodash/fp";

import {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA,
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

export const dateReadToWriteMapper = (outputKey) => ({
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
    metadata: getMetadata(entityType, metadata),
  },
});

export const durationReadToWriteMapper = (outputKey) => ({ id, ...rest }) => ({
  id,
  [outputKey]: { ...omit("enabled", rest) },
});

export const numericReadToWriteMapper = (outputKey) => ({
  id,
  previousAnswer,
  entityType,
  ...rest
}) => ({
  id,
  [outputKey]: {
    ...omit("enabled", rest),
    entityType,
    previousAnswer: getPreviousAnswer(entityType, previousAnswer),
  },
});
