const DAYS = "Days";
const MONTHS = "Months";
const YEARS = "Years";

const DURATION_LOOKUP = {
  "dd/mm/yyyy": DAYS,
  "mm/yyyy": MONTHS,
  yyyy: YEARS,
};

module.exports = {
  DAYS,
  MONTHS,
  YEARS,
  DURATION_LOOKUP,
};
