import builder from "./builder";
import {
  dateReadToWriteMapper,
  durationReadToWriteMapper,
  minValueReadToWriteMapper,
  maxValueReadToWriteMapper
} from "./readToWriteMapper";

import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";
import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";

export const LatestDate = builder(
  "Latest date",
  "latest-date-validation",
  "latestDate",
  "latestDateInput",
  LatestDateValidationRule,
  dateReadToWriteMapper
);

export const EarliestDate = builder(
  "Earliest date",
  "earliest-date-validation",
  "earliestDate",
  "earliestDateInput",
  EarliestDateValidationRule,
  dateReadToWriteMapper
);

export const MinDuration = builder(
  "Min duration",
  "min-duration-validation",
  "minDuration",
  "minDurationInput",
  MinDurationValidationRule,
  durationReadToWriteMapper
);

export const MaxDuration = builder(
  "Max duration",
  "max-duration-validation",
  "maxDuration",
  "maxDurationInput",
  MaxDurationValidationRule,
  durationReadToWriteMapper
);

export const MinValue = builder(
  "Min value",
  "min-value-validation",
  "minValue",
  "minValueInput",
  MinValueValidationRule,
  minValueReadToWriteMapper
);

export const MaxValue = builder(
  "Max value",
  "max-value-validation",
  "maxValue",
  "maxValueInput",
  MaxValueValidationRule,
  maxValueReadToWriteMapper
);
