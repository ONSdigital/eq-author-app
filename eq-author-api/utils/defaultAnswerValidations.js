const { CUSTOM, NOW } = require("../constants/validationEntityTypes");
const {
  DATE,
  DATE_RANGE,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
} = require("../constants/answerTypes");

const answerTypeMap = {
  number: [CURRENCY, NUMBER, PERCENTAGE, UNIT],
  date: [DATE],
  dateRange: [DATE_RANGE],
};

const validationRuleMap = {
  number: ["minValue", "maxValue"],
  date: ["earliestDate", "latestDate"],
  dateRange: ["earliestDate", "latestDate", "minDuration", "maxDuration"],
};

const duration = {
  value: null,
  unit: "Days",
};

const defaultValidationRuleConfigs = {
  minValue: { inclusive: true },
  maxValue: { inclusive: true },
  earliestDate: { offset: duration, relativePosition: "Before" },
  latestDate: { offset: duration, relativePosition: "After" },
  minDuration: { duration },
  maxDuration: { duration },
};

const defaultValidationEntityTypes = ({ type }) => ({
  minValue: {
    entityType: CUSTOM,
  },
  maxValue: {
    entityType: CUSTOM,
  },
  earliestDate: {
    entityType: type === DATE ? NOW : CUSTOM,
  },
  latestDate: {
    entityType: type === DATE ? NOW : CUSTOM,
  },
  minDuration: {
    entityType: CUSTOM,
  },
  maxDuration: {
    entityType: CUSTOM,
  },
});

Object.assign(module.exports, {
  answerTypeMap,
  validationRuleMap,
  defaultValidationRuleConfigs,
  defaultValidationEntityTypes,
});
