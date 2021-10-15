import { omit } from "lodash/fp";

const getCustom = (customDate) => {
  if (!customDate) {
    return null;
  }
  return customDate;
};

const getPreviousAnswer = (previousAnswer) => {
  if (!previousAnswer) {
    return null;
  }
  return previousAnswer.id;
};

const getMetadata = (metadata) => {
  if (!metadata) {
    return null;
  }
  return metadata.id;
};

export const dateReadToWriteMapper =
  (outputKey) =>
  ({ id, customDate, previousAnswer, metadata, entityType, ...rest }) => ({
    id,
    [outputKey]: {
      ...omit("enabled", rest),
      entityType,
      custom: getCustom(entityType, customDate),
      previousAnswer: getPreviousAnswer(entityType, previousAnswer),
      metadata: getMetadata(entityType, metadata),
    },
  });

export const durationReadToWriteMapper =
  (outputKey) =>
  ({ id, ...rest }) => ({
    id,
    [outputKey]: { ...omit("enabled", rest) },
  });

export const numericReadToWriteMapper =
  (outputKey) =>
  ({ id, previousAnswer, entityType, ...rest }) => ({
    id,
    [outputKey]: {
      ...omit("enabled", rest),
      entityType,
      previousAnswer: getPreviousAnswer(entityType, previousAnswer),
    },
  });
