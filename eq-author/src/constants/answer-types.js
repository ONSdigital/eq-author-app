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

export const measurements = {
  [LENGTH]: {
    name: LENGTH,
    types: {
      cm: { char: "cm", label: "Centimetres" },
      m: { char: "m", label: "Metres" },
      km: { char: "km", label: "Kilometres" },
      mi: { char: "mi", label: "Miles" }
    }
  },
  [AREA]: {
    name: AREA,
    types: {
      cm2: { char: "cm&sup2;", label: "Square centimetres" },
      m2: { char: "m&sup2;", label: "Square metres" },
      km2: { char: "m&sup2;", label: "Square kilometres" },
      mi2: { char: "mi&sup2;", label: "Square miles" }
    }
  },
  [VOLUME]: {
    name: VOLUME,
    types: {
      cm3: { char: "cm&sup3;", label: "Cubic centimetres" },
      m3: { char: "m&sup3;", label: "Cubic metres" },
      km3: { char: "km&sup3;", label: "Cubic kilometres" }
    }
  }
};

// export const duration = {
//   years: {
//     label: "Years"
//   },
//   yearsMonths: {
//     label: "Years/months"
//   },
//   line0: {
//     label: "—",
//     disabled: true
//   },
//   months: {
//     label: "Months"
//   },
//   line: {
//     label: "—",
//     disabled: true
//   },
//   days: {
//     label: "Days"
//   },
//   daysHours: {
//     label: "Days/hours"
//   },
//   line1: {
//     label: "—",
//     disabled: true
//   },
//   hours: {
//     label: "Hours"
//   },
//   hoursMinutes: {
//     label: "Hours/minutes"
//   },
//   line2: {
//     label: "—",
//     disabled: true
//   },
//   minutes: {
//     label: "Minutes"
//   }
// };

export const duration = {
  years: {
    name: "Years",
    types: {
      years: { char: "years", label: "Years" },
      yearsMonths: {
        char: "years/months",
        label: "Years/months"
      }
    }
  },
  months: {
    name: "Months",
    types: {
      months: { char: "months", label: "Months" }
    }
  },
  days: {
    name: "Days",
    types: {
      days: { char: "days", label: "Days" },
      daysHours: { char: "days/hours", label: "Days/hours" }
    }
  },
  hours: {
    name: "Hours",
    types: {
      days: { char: "hours", label: "Hours" },
      hoursMinutes: { char: "hours/minutes", label: "Hours/minutes" }
    }
  },
  minutes: {
    name: "Minutes",
    types: {
      minutes: { char: "minutes", label: "Minutes" }
    }
  }
};
