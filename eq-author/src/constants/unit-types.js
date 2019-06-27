export const CENTIMETERS = "Centimeters";
export const METERS = "Meters";
export const KILOMETERS = "Kilometers";
export const MILES = "Miles";
export const SQUARE_CENTIMETERS = "Square centimeters";
export const SQUARE_METERS = "Square meters";
export const SQUARE_KILOMETERS = "Square kilometers";
export const SQUARE_MILES = "Square miles";
export const ACRE = "Acre";
export const HECTARE = "Hectare";
export const CUBIC_CENTIMETERS = "Cubic centimeters";
export const CUBIC_METERS = "Cubic meters";
export const CUBIC_KILOMETERS = "Cubic kilometers";
export const TONNES = "Tonnes";
export const KILOJOULES = "Kilojoules";
export const KILOWATT_HOUR = "Kilowatt hour";

export const unitConversion = {
  [CENTIMETERS]: { unit: CENTIMETERS, type: "Length", abbreviation: "cm" },
  [METERS]: { unit: METERS, type: "Length", abbreviation: "m" },
  [KILOMETERS]: { unit: KILOMETERS, type: "Length", abbreviation: "km" },
  [MILES]: { unit: MILES, type: "Length", abbreviation: "mi" },
  [SQUARE_CENTIMETERS]: {
    unit: SQUARE_CENTIMETERS,
    type: "Area",
    abbreviation: `cm²`,
  },
  [SQUARE_METERS]: {
    unit: SQUARE_METERS,
    type: "Area",
    abbreviation: `m²`,
  },
  [SQUARE_KILOMETERS]: {
    unit: SQUARE_KILOMETERS,
    type: "Area",
    abbreviation: `km²`,
  },
  [SQUARE_MILES]: {
    unit: SQUARE_MILES,
    type: "Area",
    abbreviation: `mi²`,
  },
  [ACRE]: { unit: ACRE, type: "Area", abbreviation: "ac" },
  [HECTARE]: { unit: HECTARE, type: "Area", abbreviation: "ha" },
  [CUBIC_CENTIMETERS]: {
    unit: CUBIC_CENTIMETERS,
    type: "Volume",
    abbreviation: `cm³`,
  },
  [CUBIC_METERS]: {
    unit: CUBIC_METERS,
    type: "Volume",
    abbreviation: `m³`,
  },
  [CUBIC_KILOMETERS]: {
    unit: CUBIC_KILOMETERS,
    type: "Volume",
    abbreviation: `km³`,
  },
  [TONNES]: { unit: TONNES, type: "Mass", abbreviation: "t" },
  [KILOJOULES]: { unit: KILOJOULES, type: "Energy", abbreviation: "kJ" },
  [KILOWATT_HOUR]: { unit: KILOWATT_HOUR, type: "Energy", abbreviation: "kWh" },
};
