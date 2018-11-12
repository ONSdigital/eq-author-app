import dateBuilder from "./builder";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";

export const LatestDate = dateBuilder(
  "Latest date",
  "latest-date-validation",
  "latestDate",
  "latestDateInput",
  LatestDateValidationRule
);

export const EarliestDate = dateBuilder(
  "Earliest date",
  "earliest-date-validation",
  "earliestDate",
  "earliestDateInput",
  EarliestDateValidationRule
);
