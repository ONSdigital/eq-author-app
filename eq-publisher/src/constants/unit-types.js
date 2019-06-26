const CENTIMETERS = "Centimeters";
const METERS = "Meters";
const KILOMETERS = "Kilometers";
const MILES = "Miles";
const SQUARE_CENTIMETERS = "Square centimeters";
const SQUARE_METERS = "Square meters";
const SQUARE_KILOMETERS = "Square kilometers";
const SQUARE_MILES = "Square miles";
const ACRE = "Acre";
const HECTARE = "Hectare";
const CUBIC_CENTIMETERS = "Cubic centimeters";
const CUBIC_METERS = "Cubic meters";
const CUBIC_KILOMETERS = "Cubic kilometers";
const TONNES = "Tonnes";
const KILOJOULES = "Kilojoules";
const KILOWATT_HOUR = "Kilowatt hour";

const unitConversion = {
  [CENTIMETERS]: "length-centimeter",
  [METERS]: "length-meter",
  [KILOMETERS]: "length-kilometer",
  [MILES]: "length-mile",
  [SQUARE_CENTIMETERS]: "area-square-centimeter",
  [SQUARE_METERS]: "area-square-meter",
  [SQUARE_KILOMETERS]: "area-square-kilometer",
  [SQUARE_MILES]: "area-square-mile",
  [ACRE]: "area-acre",
  [HECTARE]: "area-hectare",
  [CUBIC_CENTIMETERS]: "volume-cubic-centimeter",
  [CUBIC_METERS]: "volume-cubic-meter",
  [CUBIC_KILOMETERS]: "volume-cubic-kilometer",
  [TONNES]: "mass-metric-ton",
  [KILOJOULES]: "energy-kilojoule",
  [KILOWATT_HOUR]: "energy-kilowatt-hour",
};

module.exports = {
  CENTIMETERS,
  METERS,
  KILOMETERS,
  MILES,
  SQUARE_CENTIMETERS,
  SQUARE_METERS,
  SQUARE_KILOMETERS,
  SQUARE_MILES,
  ACRE,
  HECTARE,
  CUBIC_CENTIMETERS,
  CUBIC_METERS,
  CUBIC_KILOMETERS,
  TONNES,
  KILOJOULES,
  KILOWATT_HOUR,
  unitConversion,
};
