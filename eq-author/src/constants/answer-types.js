export const CHECKBOX = "Checkbox";
export const RADIO = "Radio";
export const TEXTFIELD = "TextField";
export const TEXTAREA = "TextArea";
export const CURRENCY = "Currency";
export const NUMBER = "Number";
export const PERCENTAGE = "Percentage";
export const DATE = "Date";
export const DATE_RANGE = "DateRange";
export const UNIT = "Unit";
export const DURATION = "Duration";
export const SELECT = "Select";

export const ROUTING_ANSWER_TYPES = [
  RADIO,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  CHECKBOX,
  UNIT,
  DATE,
  SELECT,
];

export const RADIO_OPTION = "RadioOption";
export const CHECKBOX_OPTION = "CheckboxOption";
export const SELECT_OPTION = "SelectOption";
export const MUTUALLY_EXCLUSIVE = "MutuallyExclusive";
export const MUTUALLY_EXCLUSIVE_OPTION = "MutuallyExclusiveOption";

export const ANSWER_OPTION_TYPES = {
  [RADIO]: RADIO_OPTION,
  [SELECT]: SELECT_OPTION,
  [CHECKBOX]: CHECKBOX_OPTION,
};

export default [
  CHECKBOX,
  RADIO,
  TEXTFIELD,
  TEXTAREA,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  DATE,
  DATE_RANGE,
  UNIT,
  DURATION,
  SELECT,
];
