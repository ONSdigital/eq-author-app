export const YEARS = "Years";
export const MONTHS = "Months";
export const YEARSMONTHS = "YearsMonths";

export const durationConversion = {
  [YEARS]: { duration: YEARS, type: "Years", abbreviation: "Years" },
  [MONTHS]: { duration: MONTHS, type: "Months", abbreviation: "Months" },
  [YEARSMONTHS]: {
    duration: YEARSMONTHS,
    type: "Years",
    abbreviation: "Years/Months",
  },
};
