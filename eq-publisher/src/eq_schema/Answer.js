const { isNil } = require("lodash/fp");
const { get, has, pick } = require("lodash");
const {
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  DATE,
  UNIT,
  DURATION,
  TEXTAREA,
} = require("../constants/answerTypes");

const { unitConversion } = require("../constants/unit-types");

class Answer {
  constructor(answer) {
    console.log(answer);
    this.id = `answer${answer.id}`;
    this.mandatory = answer.properties.required;
    this.type = answer.type;
    this.label = answer.label;
    this.description = answer.description;
    this.q_code = answer.qCode;

    if (answer.type === UNIT) {
      this.unit = unitConversion[answer.properties.unit];
      this.unit_length = "short";
    }

    if (answer.type === DURATION) {
      const durationUnit = get(answer, "properties.unit");
      switch (durationUnit) {
        case "YearsMonths":
          this.units = ["years", "months"];
          break;

        case "Years":
          this.units = ["years"];
          break;

        case "Months":
          this.units = ["months"];
      }
    }

    if (answer.type === TEXTAREA) {
      this.max_length = parseInt(answer.properties.maxLength);
    }

    if (!isNil(answer.validation)) {
      if ([NUMBER, CURRENCY, PERCENTAGE, UNIT].includes(answer.type)) {
        const { minValue, maxValue } = answer.validation;
        this.buildNumberValidation(minValue, "min_value");
        this.buildNumberValidation(maxValue, "max_value");
      } else if (answer.type === DATE) {
        const { earliestDate, latestDate } = answer.validation;
        this.minimum = Answer.buildDateValidation(earliestDate);
        this.maximum = Answer.buildDateValidation(latestDate);
      }
    }

    if (has(answer, "properties.decimals")) {
      this.decimal_places = answer.properties.decimals;
    }

    if (!isNil(answer.parentAnswerId)) {
      this.parent_answer_id = `answer${answer.parentAnswerId}`;
    }

    if (answer.type === CURRENCY) {
      this.currency = "GBP";
    }

    if (answer.type === DATE) {
      const format = get(answer, "properties.format");

      if (format === "yyyy") {
        this.type = "YearDate";
      }

      if (format === "mm/yyyy") {
        this.type = "MonthYearDate";
      }
    }

    if (!isNil(answer.options)) {
      this.options = answer.options.map(option =>
        Answer.buildOption(option, answer)
      );
    }
  }

  static buildChildAnswer(
    { id, properties, type, label, description },
    parentAnswerId
  ) {
    return {
      id,
      properties,
      type,
      label,
      description,
      parentAnswerId,
    };
  }

  buildNumberValidation(validationRule, validationType) {
    const { enabled } = validationRule;
    if (!enabled) {
      return;
    }

    const comparator = Answer.buildComparator(validationRule);

    if (isNil(comparator)) {
      return;
    }

    this[validationType] = {
      ...comparator,
      exclusive: !validationRule.inclusive,
    };
  }

  static buildComparator(validationRule) {
    const {
      entityType = "Custom",
      custom,
      previousAnswer,
      metadata,
    } = validationRule;
    if (entityType === "Custom") {
      if (isNil(custom)) {
        return;
      }
      return { value: custom };
    }
    if (entityType === "Now") {
      return { value: "now" };
    }
    if (entityType === "PreviousAnswer") {
      if (isNil(previousAnswer)) {
        return;
      }
      return { answer_id: `answer${previousAnswer.id}` };
    }

    if (entityType === "Metadata") {
      if (isNil(metadata)) {
        return;
      }
      return { meta: metadata.key };
    }
    return;
  }

  static buildDateValidation(validationRule) {
    const { enabled } = validationRule;
    if (!enabled) {
      return;
    }

    const comparator = Answer.buildComparator(validationRule);

    if (isNil(comparator)) {
      return;
    }

    const { offset, relativePosition } = validationRule;
    const multiplier = relativePosition === "Before" ? -1 : 1;
    const offsetValue = offset.value * multiplier;
    const offsetUnit = offset.unit.toLowerCase();

    return {
      ...comparator,
      offset_by: {
        [offsetUnit]: offsetValue,
      },
    };
  }

  static buildOption(
    { label, description, additionalAnswer, qCode: q_code },
    { properties }
  ) {
    const option = {
      label,
      value: label,
      q_code,
    };

    if (description) {
      option.description = description;
    }
    if (additionalAnswer) {
      option.detail_answer = {
        ...pick(additionalAnswer, ["label", "type"]),
        id: `answer${additionalAnswer.id}`,
        mandatory: properties.required,
      };
    }
    return option;
  }
}

module.exports = Answer;
