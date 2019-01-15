const Answer = require("./Answer");
const {
  parseContent,
  getInnerHTMLWithPiping,
  unescapePiping
} = require("../utils/HTMLUtils");
const { find, get, flow, isNil, assign, concat } = require("lodash/fp");
const { set } = require("lodash");
const convertPipes = require("../utils/convertPipes");

const findDateRange = flow(
  get("answers"),
  find({ type: "DateRange" })
);

const findMutuallyExclusive = flow(
  get("answers"),
  find(answer => !isNil(get("mutuallyExclusiveOption", answer)))
);

const processPipedText = ctx =>
  flow(
    convertPipes(ctx),
    getInnerHTMLWithPiping
  );

const processContent = ctx =>
  flow(
    convertPipes(ctx),
    parseContent
  );

class Question {
  constructor(question, ctx) {
    this.id = `question${question.id}`;
    this.title = processPipedText(ctx)(question.title);
    this.description = processPipedText(ctx)(question.description);
    this.guidance = processContent(ctx)(question.guidance);
    this.description = unescapePiping(convertPipes(ctx)(question.description));

    if (question.definitionLabel || question.definitionContent) {
      this.definitions = [
        {
          title: question.definitionLabel,
          ...processContent(ctx)(question.definitionContent)
        }
      ];
    }

    const dateRange = findDateRange(question);

    const mutuallyExclusive = findMutuallyExclusive(question);

    if (dateRange) {
      this.type = "DateRange";
      this.answers = this.buildDateRangeAnswers(dateRange);

      const {
        earliestDate,
        latestDate,
        minDuration,
        maxDuration
      } = dateRange.validation;

      if (earliestDate.enabled || latestDate.enabled) {
        this.answers[0].minimum = Answer.buildDateValidation(earliestDate);
        this.answers[1].maximum = Answer.buildDateValidation(latestDate);
      }

      if (minDuration.enabled || maxDuration.enabled) {
        /* eslint-disable-next-line camelcase */
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
    } else if (mutuallyExclusive) {
      this.type = "MutuallyExclusive";
      this.mandatory = get("properties.required", mutuallyExclusive);
      this.answers = this.buildMutuallyExclusiveAnswers(mutuallyExclusive);
    } else {
      this.type = "General";
      this.answers = this.buildAnswers(question.answers);
    }
  }

  buildAnswers(answers) {
    return answers.map(answer => new Answer(answer));
  }

  buildDateRangeAnswers(answer) {
    return answer.childAnswers.map(
      childAnswer =>
        new Answer(
          assign(childAnswer, { type: "Date", properties: answer.properties })
        )
    );
  }

  buildMutuallyExclusiveAnswers(mutuallyExclusive) {
    Object.assign(mutuallyExclusive.properties, { required: false });
    const mutuallyExclusiveAnswer = new Answer({
      ...mutuallyExclusive,
      id: `${mutuallyExclusive.id}-exclusive`,
      type: "Checkbox",
      options: [mutuallyExclusive.mutuallyExclusiveOption]
    });

    return concat(
      this.buildAnswers([mutuallyExclusive]),
      mutuallyExclusiveAnswer
    );
  }
}

module.exports = Question;
