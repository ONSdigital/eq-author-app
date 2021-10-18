import { omit } from "lodash/fp";

const getCustom = (customDate) => {
  return customDate && customDate;
};

const getPreviousAnswer = (previousAnswer) => {
  return previousAnswer && previousAnswer.id;
};

const getMetadata = (metadata) => {
  return metadata && metadata.id;
};

export const dateReadToWriteMapper =
  (outputKey) =>
  ({ id, customDate, previousAnswer, metadata, entityType, ...rest }) => ({
    id,
    [outputKey]: {
      ...omit("enabled", rest),
      entityType,
      custom: getCustom(customDate),
      previousAnswer: getPreviousAnswer(previousAnswer),
      metadata: getMetadata(metadata),
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
      previousAnswer: getPreviousAnswer(previousAnswer),
    },
  });
