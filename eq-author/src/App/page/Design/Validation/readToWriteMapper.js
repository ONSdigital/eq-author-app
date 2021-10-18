import { omit } from "lodash/fp";

export const dateReadToWriteMapper =
  (outputKey) =>
  ({ id, customDate, previousAnswer, metadata, entityType, ...rest }) => ({
    id,
    [outputKey]: {
      ...omit("enabled", rest),
      entityType,
      custom: customDate,
      previousAnswer: previousAnswer?.id ?? null,
      metadata: metadata?.id ?? null,
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
      previousAnswer: previousAnswer?.id ?? null,
    },
  });
