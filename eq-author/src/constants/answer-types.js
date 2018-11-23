export const CHECKBOX = "Checkbox";
export const RADIO = "Radio";
export const TEXTFIELD = "TextField";
export const TEXTAREA = "TextArea";
export const CURRENCY = "Currency";
export const NUMBER = "Number";
export const MEASUREMENT = "Measurement";
export const PERCENTAGE = "Percentage";
export const TIME = "Duration";
export const DATE = "Date";
export const DATE_RANGE = "DateRange";

export const LENGTH = "Length";
export const AREA = "Area";
export const VOLUME = "Volume";

export const YEARS = "Years";
export const MONTHS = "Months";
export const DAYS = "Days";
export const HOURS = "Hours";
export const MINUTES = "Minutes";

// msu = most significant unit

export const measurements = {
  [LENGTH]: {
    name: LENGTH,
    types: {
      cm: { char: "cm", msu: "cm", label: "Centimetres" },
      m: { char: "m", msu: "m", label: "Metres" },
      km: { char: "km", msu: "km", label: "Kilometres" },
      mi: { char: "mi", msu: "mi", label: "Miles" }
    }
  },
  [AREA]: {
    name: AREA,
    types: {
      cm2: { char: "cm&sup2;", msu: "cm&sup2;", label: "Square centimetres" },
      m2: { char: "m&sup2;", msu: "m&sup2;", label: "Square metres" },
      km2: { char: "m&sup2;", msu: "m&sup2;", label: "Square kilometres" },
      mi2: { char: "mi&sup2;", msu: "mi&sup2;", label: "Square miles" }
    }
  },
  [VOLUME]: {
    name: VOLUME,
    types: {
      cm3: { char: "cm&sup3;", msu: "cm&sup3;", label: "Cubic centimetres" },
      m3: { char: "m&sup3;", msu: "m&sup3;", label: "Cubic metres" },
      km3: { char: "km&sup3;", msu: "km&sup3;", label: "Cubic kilometres" }
    }
  }
};

export const duration = {
  [YEARS]: {
    name: YEARS,
    types: {
      years: { char: "years", msu: "years", label: "Years" },
      yearsMonths: {
        char: "years/months",
        msu: "years",
        label: "Years/months"
      }
    }
  },
  [MONTHS]: {
    name: MONTHS,
    types: {
      months: { char: "months", msu: "months", label: "Months" }
    }
  },
  [DAYS]: {
    name: DAYS,
    types: {
      days: { char: "days", msu: "days", label: "Days" },
      daysHours: { char: "days/hours", msu: "days", label: "Days/hours" }
    }
  },
  [HOURS]: {
    name: HOURS,
    types: {
      days: { char: "hours", msu: "hours", label: "Hours" },
      hoursMinutes: {
        char: "hours/minutes",
        msu: "hours",
        label: "Hours/minutes"
      }
    }
  },
  [MINUTES]: {
    name: MINUTES,
    types: {
      minutes: { char: "minutes", msu: "minutes", label: "Minutes" }
    }
  }
};
