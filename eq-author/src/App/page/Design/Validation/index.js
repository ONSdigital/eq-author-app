import builder from "./builder";
import {
  dateReadToWriteMapper,
  durationReadToWriteMapper,
  numericReadToWriteMapper,
} from "./readToWriteMapper";

export const LatestDate = builder(
  "Latest date",
  "latest-date-validation",
  "latestDate",
  "latestDateInput",
  dateReadToWriteMapper
);

export const EarliestDate = builder(
  "Earliest date",
  "earliest-date-validation",
  "earliestDate",
  "earliestDateInput",
  dateReadToWriteMapper
);

export const MinDuration = builder(
  "Min duration",
  "min-duration-validation",
  "minDuration",
  "minDurationInput",
  durationReadToWriteMapper
);

export const MaxDuration = builder(
  "Max duration",
  "max-duration-validation",
  "maxDuration",
  "maxDurationInput",
  durationReadToWriteMapper
);

export const MinValue = builder(
  "Min value",
  "min-value-validation",
  "minValue",
  "minValueInput",
  numericReadToWriteMapper
);

export const MaxValue = builder(
  "Max value",
  "max-value-validation",
  "maxValue",
  "maxValueInput",
  numericReadToWriteMapper
);
