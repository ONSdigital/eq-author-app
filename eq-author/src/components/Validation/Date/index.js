import builder from "components/Validation/Date/builder";
import {
  dateReadToWriteMapper,
  durationReadToWriteMapper
} from "components/Validation/Date/readToWriteMapper";
import DateValidation from "components/Validation/Date/DateValidation";
import DurationValidation from "components/Validation/Date/DurationValidation";

import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";

export const LatestDate = builder(
  "Latest date",
  "latest-date-validation",
  "latestDate",
  "latestDateInput",
  LatestDateValidationRule,
  dateReadToWriteMapper,
  "date"
)(DateValidation);

export const EarliestDate = builder(
  "Earliest date",
  "earliest-date-validation",
  "earliestDate",
  "earliestDateInput",
  EarliestDateValidationRule,
  dateReadToWriteMapper,
  "date"
)(DateValidation);

export const MinDuration = builder(
  "Min duration",
  "min-duration-validation",
  "minDuration",
  "minDurationInput",
  MinDurationValidationRule,
  durationReadToWriteMapper,
  "duration"
)(DurationValidation);

export const MaxDuration = builder(
  "Max duration",
  "max-duration-validation",
  "maxDuration",
  "maxDurationInput",
  MaxDurationValidationRule,
  durationReadToWriteMapper,
  "duration"
)(DurationValidation);
