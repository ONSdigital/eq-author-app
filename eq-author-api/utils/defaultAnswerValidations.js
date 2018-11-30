const { CUSTOM, NOW } = require("../constants/validationEntityTypes");
const { DATE } = require("../constants/answerTypes");

const answerTypeMap = {
  number: ["Currency", "Number"],
  date: ["Date", "DateRange"]
};

const validationRuleMap = {
  number: ["minValue", "maxValue"],
  date: ["earliestDate", "latestDate"],
};

const defaultValidationRuleConfigs = {
  minValue: {
    inclusive: false
  },
  maxValue: {
    inclusive: false
  },
  earliestDate: {
    offset: {
      value: 0,
      unit: "Days"
    },
    relativePosition: "Before"
  },
  latestDate: {
    offset: {
      value: 0,
      unit: "Days"
    },
    relativePosition: "After"
  }
};

const defaultValidationEntityTypes = ({type}) => ({
  minValue: {
    entityType: CUSTOM
  },
  maxValue: {
    entityType: CUSTOM
  },
  earliestDate: {
    entityType: type === DATE ? NOW : CUSTOM
  },
  latestDate: {
    entityType:  type === DATE ? NOW : CUSTOM
  }
});

Object.assign(module.exports, {
  answerTypeMap,
  validationRuleMap,
  defaultValidationRuleConfigs,
  defaultValidationEntityTypes
});
