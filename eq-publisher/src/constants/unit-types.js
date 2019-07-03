const CENTIMETRES = "Centimetres";
const METRES = "Metres";
const KILOMETRES = "Kilometres";
const MILES = "Miles";
const SQUARE_CENTIMETRES = "Square centimetres";
const SQUARE_METRES = "Square metres";
const SQUARE_KILOMETRES = "Square kilometres";
const SQUARE_MILES = "Square miles";
const ACRES = "Acres";
const HECTARES = "Hectares";
const CUBIC_CENTIMETRES = "Cubic centimetres";
const CUBIC_METRES = "Cubic metres";
const CUBIC_KILOMETRES = "Cubic kilometres";
const TONNES = "Tonnes";
const KILOJOULES = "Kilojoules";
const KILOWATT_HOURS = "Kilowatt hours";
const LITRES = "Litres";
const HECTOLITRES = "Hectolitres";
const MEGALITRES = "Megalitres";

const unitConversion = {
  [CENTIMETRES]: "length-centimeter",
  [METRES]: "length-meter",
  [KILOMETRES]: "length-kilometer",
  [MILES]: "length-mile",
  [SQUARE_CENTIMETRES]: "area-square-centimeter",
  [SQUARE_METRES]: "area-square-meter",
  [SQUARE_KILOMETRES]: "area-square-kilometer",
  [SQUARE_MILES]: "area-square-mile",
  [ACRES]: "area-acre",
  [HECTARES]: "area-hectare",
  [CUBIC_CENTIMETRES]: "volume-cubic-centimeter",
  [CUBIC_METRES]: "volume-cubic-meter",
  [CUBIC_KILOMETRES]: "volume-cubic-kilometer",
  [LITRES]: "volume-liter",
  [HECTOLITRES]: "volume-hectoliter",
  [MEGALITRES]: "volume-megaliter",
  [TONNES]: "mass-metric-ton",
  [KILOJOULES]: "energy-kilojoule",
  [KILOWATT_HOURS]: "energy-kilowatt-hour",
};

module.exports = {
  CENTIMETRES,
  METRES,
  KILOMETRES,
  MILES,
  SQUARE_CENTIMETRES,
  SQUARE_METRES,
  SQUARE_KILOMETRES,
  SQUARE_MILES,
  ACRES,
  HECTARES,
  CUBIC_CENTIMETRES,
  CUBIC_METRES,
  CUBIC_KILOMETRES,
  TONNES,
  KILOJOULES,
  KILOWATT_HOURS,
  unitConversion,
};
