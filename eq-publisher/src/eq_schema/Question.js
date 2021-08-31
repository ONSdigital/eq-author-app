const Answer = require("./Answer");
const {
  parseContent,
  getInnerHTMLWithPiping,
  unescapePiping,
} = require("../utils/HTMLUtils");
const { find, get, flow, isNil, concat, last } = require("lodash/fp");
const { set } = require("lodash");
const convertPipes = require("../utils/convertPipes");
const { DATE, DATE_RANGE } = require("../constants/answerTypes");
const findDateRange = flow(get("answers"), find({ type: DATE_RANGE }));

const findMutuallyExclusive = flow(
  get("answers"),
  find((answer) => !isNil(get("mutuallyExclusiveOption", answer)))
);

const processPipedText = (ctx) =>
  flow(convertPipes(ctx), getInnerHTMLWithPiping);

const processContent = (ctx) => flow(convertPipes(ctx), parseContent);

class Question {
  constructor(question, ctx) {
    this.id = `question${question.id}`;
    this.title = processPipedText(ctx)(question.title);
    if (question.qCode) {
      this.q_code = question.qCode;
    }
    if (question.descriptionEnabled && question.description) {
      this.description = processPipedText(ctx)(question.description);
      this.description = unescapePiping(
        convertPipes(ctx)(question.description)
      );
    }

    if (question.guidanceEnabled && question.guidance) {
      this.guidance = processContent(ctx)(question.guidance);
    }

    if (
      question.definitionEnabled &&
      (question.definitionLabel || question.definitionContent)
    ) {
      this.definitions = [
        {
          title: question.definitionLabel,
          ...processContent(ctx)(question.definitionContent),
        },
      ];
    }

    const dateRange = findDateRange(question);
    const mutuallyExclusive = findMutuallyExclusive(question);

    if (dateRange) {
      this.type = DATE_RANGE;
      this.answers = this.buildDateRangeAnswers(dateRange);
      const { earliestDate, latestDate, minDuration, maxDuration } =
        dateRange.validation;

      if (dateRange.advancedProperties) {
        if (earliestDate.enabled || latestDate.enabled) {
          this.answers[0].minimum = Answer.buildDateValidation(earliestDate);
          this.answers[1].maximum = Answer.buildDateValidation(latestDate);
        }

        if (minDuration.enabled || maxDuration.enabled) {
          if (minDuration.enabled) {
            set(
              this,
              `period_limits.minimum.${minDuration.duration.unit}`.toLowerCase(),
              minDuration.duration.value
            );
          }
          if (maxDuration.enabled) {
            set(
              this,
              `period_limits.maximum.${maxDuration.duration.unit}`.toLowerCase(),
              maxDuration.duration.value
            );
          }
        }
      }
    } else if (mutuallyExclusive) {
      this.type = "MutuallyExclusive";
      this.mandatory = get("properties.required", mutuallyExclusive);
      this.answers = this.buildMutuallyExclusiveAnswers(mutuallyExclusive);
      delete this.answers[1].label;
    } else if (question.totalValidation && question.totalValidation.enabled) {
      this.type = "Calculated";
      this.answers = this.buildAnswers(question.answers);
      this.calculations = [
        this.buildCalculation(question.totalValidation, question.answers),
      ];
    } else {
      this.type = "General";
      this.answers = this.buildAnswers(question.answers);
    }

    if (
      question.additionalInfoEnabled &&
      (question.additionalInfoLabel || question.additionalInfoContent)
    ) {
      if (!this.answers.length) {
        throw new Error(
          `Cannot add additional information to question '${question.id}' because it has no answers.`
        );
      }

      last(this.answers).guidance = {
        show_guidance: question.additionalInfoLabel,
        hide_guidance: question.additionalInfoLabel,
        ...processContent(ctx)(question.additionalInfoContent),
      };
    }
  }

  buildAnswers(answers) {
    return answers.map((answer) => new Answer(answer));
  }

  buildDateRangeAnswers(answer) {
    const commonAnswerDef = {
      id: `answer${answer.id}`,
      type: DATE,
      mandatory: get("properties.required", answer),
    };
    const dateFrom = {
      ...commonAnswerDef,
      id: `${commonAnswerDef.id}from`,
      label: answer.label,
    };
    if (answer.qCode) {
      dateFrom.q_code = answer.qCode;
    }
    const dateTo = {
      ...commonAnswerDef,
      id: `${commonAnswerDef.id}to`,
      label: answer.secondaryLabel,
    };
    if (answer.secondaryQCode) {
      dateTo.q_code = answer.secondaryQCode;
    }
    return [dateFrom, dateTo];
  }

  buildMutuallyExclusiveAnswers(mutuallyExclusive) {
    Object.assign(mutuallyExclusive.properties, { required: false });
    const mutuallyExclusiveAnswer = new Answer({
      ...mutuallyExclusive,
      properties: { required: false },
      id: `${mutuallyExclusive.id}-exclusive`,
      type: "Checkbox",
      options: [mutuallyExclusive.mutuallyExclusiveOption],
    });

    return concat(
      this.buildAnswers([mutuallyExclusive]),
      mutuallyExclusiveAnswer
    );
  }

  buildCalculation(totalValidation, answers) {
    const GREATER_THAN = "greater than";
    const LESS_THAN = "less than";
    const EQUALS = "equals";

    const AUTHOR_TO_RUNNER_CONDITIONS = {
      GreaterThan: [GREATER_THAN],
      GreaterOrEqual: [GREATER_THAN, EQUALS],
      Equal: [EQUALS],
      LessOrEqual: [LESS_THAN, EQUALS],
      LessThan: [LESS_THAN],
    };

    const rightSide =
      totalValidation.entityType === "Custom"
        ? { value: totalValidation.custom }
        : { answer_id: `answer${totalValidation.previousAnswer.id}` };

    return {
      calculation_type: "sum",
      answers_to_calculate: answers.map((a) => `answer${a.id}`),
      conditions: AUTHOR_TO_RUNNER_CONDITIONS[totalValidation.condition],
      ...rightSide,
    };
  }
}

module.exports = Question;
