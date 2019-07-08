export const CENTIMETRES = "Centimetres";
export const METRES = "Metres";
export const KILOMETRES = "Kilometres";
export const MILES = "Miles";
export const SQUARE_CENTIMETRES = "Square centimetres";
export const SQUARE_METRES = "Square metres";
export const SQUARE_KILOMETRES = "Square kilometres";
export const SQUARE_MILES = "Square miles";
export const ACRES = "Acres";
export const HECTARES = "Hectares";
export const CUBIC_CENTIMETRES = "Cubic centimetres";
export const CUBIC_METRES = "Cubic metres";
export const CUBIC_KILOMETRES = "Cubic kilometres";
export const LITRES = "Litres";
export const HECTOLITRES = "Hectolitres";
export const MEGALITRES = "Megalitres";
export const TONNES = "Tonnes";
export const KILOJOULES = "Kilojoules";
export const KILOWATT_HOURS = "Kilowatt hours";

export const unitConversion = {
  [CENTIMETRES]: { unit: CENTIMETRES, type: "Length", abbreviation: "cm" },
  [METRES]: { unit: METRES, type: "Length", abbreviation: "m" },
  [KILOMETRES]: { unit: KILOMETRES, type: "Length", abbreviation: "km" },
  [MILES]: { unit: MILES, type: "Length", abbreviation: "mi" },
  [SQUARE_CENTIMETRES]: {
    unit: SQUARE_CENTIMETRES,
    type: "Area",
    abbreviation: `cm²`,
  },
  [SQUARE_METRES]: {
    unit: SQUARE_METRES,
    type: "Area",
    abbreviation: `m²`,
  },
  [SQUARE_KILOMETRES]: {
    unit: SQUARE_KILOMETRES,
    type: "Area",
    abbreviation: `km²`,
  },
  [SQUARE_MILES]: {
    unit: SQUARE_MILES,
    type: "Area",
    abbreviation: `sq mi`,
  },
  [ACRES]: { unit: ACRES, type: "Area", abbreviation: "ac" },
  [HECTARES]: { unit: HECTARES, type: "Area", abbreviation: "ha" },
  [CUBIC_CENTIMETRES]: {
    unit: CUBIC_CENTIMETRES,
    type: "Volume",
    abbreviation: `cm³`,
  },
  [CUBIC_METRES]: {
    unit: CUBIC_METRES,
    type: "Volume",
    abbreviation: `m³`,
  },
  [CUBIC_KILOMETRES]: {
    unit: CUBIC_KILOMETRES,
    type: "Volume",
    abbreviation: `km³`,
  },
  [LITRES]: {
    unit: LITRES,
    type: "Volume",
    abbreviation: `l`,
  },
  [HECTOLITRES]: {
    unit: HECTOLITRES,
    type: "Volume",
    abbreviation: `hl`,
  },
  [MEGALITRES]: {
    unit: MEGALITRES,
    type: "Volume",
    abbreviation: `Ml`,
  },
  [TONNES]: { unit: TONNES, type: "Mass", abbreviation: "t" },
  [KILOJOULES]: { unit: KILOJOULES, type: "Energy", abbreviation: "kJ" },
  [KILOWATT_HOURS]: {
    unit: KILOWATT_HOURS,
    type: "Energy",
    abbreviation: "kWh",
  },
};
