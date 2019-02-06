const { first } = require("lodash");
const executeQuery = require("../../tests/utils/executeQuery");
const {
  getAnswerValidations,
  toggleAnswerValidation,
  updateAnswerValidation,
} = require("../../tests/utils/graphql");

const {
  createQuestionnaire,
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  createMetadata,
} = require("../../tests/utils/questionnaireBuilder/metadata");

const {
  createAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

const {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA,
  NOW,
} = require("../../constants/validationEntityTypes");

const {
  NUMBER,
  CURRENCY,
  DATE,
  DATE_RANGE,
} = require("../../constants/answerTypes");

describe("resolvers", () => {
  let questionnaire;
  let sections;
  let pages;
  let firstPage;

  let queryAnswerValidations;
  let mutateValidationToggle;
  let mutateValidationParameters;

  queryAnswerValidations = async id => {
    const result = await executeQuery(
      getAnswerValidations,
      {
        input: { answerId: id },
      },
      questionnaire
    );
    if (result.errors) {
      throw new Error(result.errors[0]);
    }
    return result.data.answer.validation;
  };

  mutateValidationToggle = async input => {
    const result = await executeQuery(
      toggleAnswerValidation,
      {
        input,
      },
      questionnaire
    );

    return result.data.toggleValidationRule;
  };

  mutateValidationParameters = async input => {
    const result = await executeQuery(
      updateAnswerValidation,
      {
        input,
      },
      questionnaire
    );
    if (result.errors) {
      throw new Error(result.errors[0]);
    }
    return result.data.updateValidationRule;
  };

  beforeEach(async () => {
    questionnaire = await createQuestionnaire();
    sections = questionnaire.sections;
    pages = first(sections).pages;
    firstPage = first(pages);
  });

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("All", () => {
    it("can toggle any validation rule on and off without affecting another", async () => {
      const currencyAnswer = await createAnswer(
        questionnaire,
        firstPage,
        CURRENCY
      );
      let currencyValidation = await queryAnswerValidations(currencyAnswer.id);

      await mutateValidationToggle({
        id: currencyValidation.minValue.id,
        enabled: true,
      });

      currencyValidation = await queryAnswerValidations(currencyAnswer.id);

      expect(currencyValidation.minValue).toHaveProperty("enabled", true);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);

      await mutateValidationToggle({
        id: currencyValidation.minValue.id,
        enabled: false,
      });

      currencyValidation = await queryAnswerValidations(currencyAnswer.id);

      expect(currencyValidation.minValue).toHaveProperty("enabled", false);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);
    });
  });

  describe("Number and Currency", () => {
    it("should create min and max validation db entries for Currency and Number answers", async () => {
      const currencyAnswer = await createAnswer(
        questionnaire,
        firstPage,
        CURRENCY
      );
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const numberAnswer = await createAnswer(questionnaire, firstPage, NUMBER);
      const numberValidation = await queryAnswerValidations(numberAnswer.id);

      const validationObject = (minValueId, maxValueId) => ({
        minValue: {
          id: minValueId,
          enabled: false,
          inclusive: false,
          custom: null,
          entityType: CUSTOM,
        },
        maxValue: {
          id: maxValueId,
          enabled: false,
          inclusive: false,
          custom: null,
          entityType: CUSTOM,
        },
      });
      expect(currencyValidation).toEqual(
        validationObject(
          currencyValidation.minValue.id,
          currencyValidation.maxValue.id
        )
      );
      expect(numberValidation).toEqual(
        validationObject(
          numberValidation.minValue.id,
          numberValidation.maxValue.id
        )
      );
    });

    it("can update inclusive and custom min values", async () => {
      const currencyAnswer = await createAnswer(
        questionnaire,
        firstPage,
        CURRENCY
      );
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const result = await mutateValidationParameters({
        id: currencyValidation.minValue.id,
        minValueInput: {
          custom: 10,
          inclusive: true,
        },
      });
      expect(result).toMatchObject({
        id: currencyValidation.minValue.id,
        custom: 10,
        inclusive: true,
      });
    });

    it("can update inclusive and custom max values", async () => {
      const currencyAnswer = await createAnswer(
        questionnaire,
        firstPage,
        CURRENCY
      );
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const result = await mutateValidationParameters({
        id: currencyValidation.maxValue.id,
        maxValueInput: {
          custom: 10,
          inclusive: true,
        },
      });

      expect(result).toMatchObject({
        id: currencyValidation.maxValue.id,
        custom: 10,
        inclusive: true,
      });
    });

    it("can update inclusive and previous answer min values", async () => {
      const previousAnswer = await createAnswer(
        questionnaire,
        firstPage,
        NUMBER
      );
      const numberAnswer = await createAnswer(questionnaire, firstPage, NUMBER);
      const numberValidation = await queryAnswerValidations(numberAnswer.id);

      const result = await mutateValidationParameters({
        id: numberValidation.minValue.id,
        minValueInput: {
          previousAnswer: previousAnswer.id,
          inclusive: true,
        },
      });

      expect(result).toMatchObject({
        id: numberValidation.minValue.id,
        previousAnswer: {
          id: previousAnswer.id,
        },
        inclusive: true,
      });
    });

    it("can update inclusive and previous answer max values", async () => {
      const previousAnswer = await createAnswer(
        questionnaire,
        firstPage,
        NUMBER
      );
      const numberAnswer = await createAnswer(questionnaire, firstPage, NUMBER);
      const numberValidation = await queryAnswerValidations(numberAnswer.id);

      const result = await mutateValidationParameters({
        id: numberValidation.maxValue.id,
        maxValueInput: {
          previousAnswer: previousAnswer.id,
          inclusive: true,
        },
      });

      expect(result).toMatchObject({
        id: numberValidation.maxValue.id,
        previousAnswer: {
          id: previousAnswer.id,
        },
        inclusive: true,
      });
    });

    it("can update inclusive and entity type", async () => {
      const currencyAnswer = await createAnswer(
        questionnaire,
        firstPage,
        CURRENCY
      );
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA];

      const promises = entityTypes.map(async entityType => {
        const result = await mutateValidationParameters({
          id: currencyValidation.maxValue.id,
          maxValueInput: {
            entityType,
            inclusive: true,
          },
        });

        expect(result).toMatchObject({
          id: currencyValidation.maxValue.id,
          entityType,
        });
      });

      await Promise.all(promises);
    });
  });

  describe("Date", () => {
    let params;

    beforeEach(() => {
      params = {
        entityType: CUSTOM,
        offset: {
          value: 8,
          unit: "Months",
        },
        relativePosition: "After",
      };
    });

    it("should default earliest and latest date to NOW entityType", async () => {
      const answer = await createAnswer(questionnaire, firstPage, DATE);
      const validation = await queryAnswerValidations(answer.id);
      expect(validation.earliestDate.entityType).toEqual(NOW);
      expect(validation.latestDate.entityType).toEqual(NOW);
    });

    it("should create earliest validation db entries for Date answers", async () => {
      const answer = await createAnswer(questionnaire, firstPage, "Date");
      const validation = await queryAnswerValidations(answer.id);
      const validationObject = (earliestId, latestId) => ({
        earliestDate: {
          id: earliestId,
          enabled: false,
          offset: {
            value: 0,
            unit: "Days",
          },
          relativePosition: "Before",
          custom: null,
        },
        latestDate: {
          id: latestId,
          offset: {
            value: 0,
            unit: "Days",
          },
          relativePosition: "After",
          custom: null,
        },
      });

      expect(validation).toMatchObject(
        validationObject(validation.earliestDate.id, validation.latestDate.id)
      );
    });

    describe("Earliest", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);
        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            custom: "2017-01-01",
          },
        });
        const expected = {
          id: validation.earliestDate.id,
          ...params,
          customDate: "2017-01-01",
          previousAnswer: null,
          metadata: null,
        };
        expect(result).toEqual(expected);
      });

      it("can update previous answer", async () => {
        const previousAnswer = await createAnswer(
          questionnaire,
          firstPage,
          DATE
        );
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            entityType: PREVIOUS_ANSWER,
            previousAnswer: previousAnswer.id,
          },
        });

        expect(result).toMatchObject({
          entityType: PREVIOUS_ANSWER,
          previousAnswer: {
            id: previousAnswer.id,
          },
        });
      });

      it("can update metadata", async () => {
        const metadata = await createMetadata(questionnaire);
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            entityType: METADATA,
            metadata: metadata.id,
          },
        });

        expect(result).toMatchObject({
          entityType: METADATA,
          metadata: {
            id: metadata.id,
          },
        });
      });

      it("can update entity type", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        const promises = entityTypes.map(async entityType => {
          const result = await mutateValidationParameters({
            id: validation.earliestDate.id,
            earliestDateInput: {
              ...params,
              entityType,
            },
          });

          expect(result).toMatchObject({
            id: validation.earliestDate.id,
            entityType,
          });
        });

        await Promise.all(promises);
      });
    });

    describe("Latest", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);
        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            custom: "2017-01-01",
            ...params,
          },
        });
        const expected = {
          id: validation.latestDate.id,
          customDate: "2017-01-01",
          previousAnswer: null,
          metadata: null,
          ...params,
        };

        expect(result).toEqual(expected);
      });

      it("can update previous answer", async () => {
        const previousAnswer = await createAnswer(
          questionnaire,
          firstPage,
          DATE
        );
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            ...params,
            entityType: PREVIOUS_ANSWER,
            previousAnswer: previousAnswer.id,
          },
        });

        expect(result).toMatchObject({
          entityType: PREVIOUS_ANSWER,
          previousAnswer: {
            id: previousAnswer.id,
          },
        });
      });

      it("can update metadata", async () => {
        const metadata = await createMetadata(questionnaire);
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            ...params,
            entityType: METADATA,
            metadata: metadata.id,
          },
        });

        expect(result).toMatchObject({
          entityType: METADATA,
          metadata: {
            id: metadata.id,
          },
        });
      });

      it("can update entity type", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE);
        const validation = await queryAnswerValidations(answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        const promises = entityTypes.map(async entityType => {
          const result = await mutateValidationParameters({
            id: validation.latestDate.id,
            latestDateInput: {
              ...params,
              entityType,
            },
          });

          expect(result).toMatchObject({
            id: validation.latestDate.id,
            entityType,
          });
        });

        await Promise.all(promises);
      });
    });
  });

  describe("DateRange", () => {
    let params;

    beforeEach(() => {
      params = {
        entityType: CUSTOM,
        offset: {
          value: 8,
          unit: "Months",
        },
        relativePosition: "After",
      };
    });

    it("should default earliest and latest date to CUSTOM entityType", async () => {
      const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
      const validation = await queryAnswerValidations(answer.id);

      expect(validation.earliestDate.entityType).toEqual(CUSTOM);
      expect(validation.latestDate.entityType).toEqual(CUSTOM);
    });

    it("should create earliest validation db entries for DateRange answers", async () => {
      const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
      const validation = await queryAnswerValidations(answer.id);
      const validationObject = (earliestId, latestId) => ({
        earliestDate: {
          id: earliestId,
          enabled: false,
          offset: {
            value: 0,
            unit: "Days",
          },
          relativePosition: "Before",
          custom: null,
        },
        latestDate: {
          id: latestId,
          offset: {
            value: 0,
            unit: "Days",
          },
          relativePosition: "After",
          custom: null,
        },
      });

      expect(validation).toMatchObject(
        validationObject(validation.earliestDate.id, validation.latestDate.id)
      );
    });

    describe("Earliest", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);
        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            custom: "2017-01-01",
          },
        });
        const expected = {
          id: validation.earliestDate.id,
          ...params,
          customDate: "2017-01-01",
          previousAnswer: null,
          metadata: null,
        };
        expect(result).toEqual(expected);
      });

      it("can update metadata", async () => {
        const metadata = await createMetadata(questionnaire);
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            entityType: METADATA,
            metadata: metadata.id,
          },
        });

        expect(result).toMatchObject({
          entityType: METADATA,
          metadata: {
            id: metadata.id,
          },
        });
      });

      it("can update entity type", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);

        const entityTypes = [CUSTOM, METADATA];

        const promises = entityTypes.map(async entityType => {
          const result = await mutateValidationParameters({
            id: validation.earliestDate.id,
            earliestDateInput: {
              ...params,
              entityType,
            },
          });

          expect(result).toMatchObject({
            id: validation.earliestDate.id,
            entityType,
          });
        });

        await Promise.all(promises);
      });
    });

    describe("Latest", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);
        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            custom: "2017-01-01",
            ...params,
          },
        });
        const expected = {
          id: validation.latestDate.id,
          customDate: "2017-01-01",
          previousAnswer: null,
          metadata: null,
          ...params,
        };

        expect(result).toEqual(expected);
      });

      it("can update metadata", async () => {
        const metadata = await createMetadata(questionnaire);
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            ...params,
            entityType: METADATA,
            metadata: metadata.id,
          },
        });

        expect(result).toMatchObject({
          entityType: METADATA,
          metadata: {
            id: metadata.id,
          },
        });
      });

      it("can update entity type", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);

        const entityTypes = [CUSTOM, METADATA];

        const promises = entityTypes.map(async entityType => {
          const result = await mutateValidationParameters({
            id: validation.latestDate.id,
            latestDateInput: {
              ...params,
              entityType,
            },
          });

          expect(result).toMatchObject({
            id: validation.latestDate.id,
            entityType,
          });
        });

        await Promise.all(promises);
      });
    });

    describe("MinDuration", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);
        const input = {
          duration: {
            value: 8,
            unit: "Days",
          },
        };
        const result = await mutateValidationParameters({
          id: validation.minDuration.id,
          minDurationInput: {
            ...input,
          },
        });
        const expected = {
          id: validation.minDuration.id,
          ...input,
        };
        expect(result).toEqual(expected);
      });
    });

    describe("MaxDuration", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, firstPage, DATE_RANGE);
        const validation = await queryAnswerValidations(answer.id);
        const input = {
          duration: {
            value: 8,
            unit: "Days",
          },
        };
        const result = await mutateValidationParameters({
          id: validation.maxDuration.id,
          maxDurationInput: {
            ...input,
          },
        });
        const expected = {
          id: validation.maxDuration.id,
          ...input,
        };
        expect(result).toEqual(expected);
      });
    });
  });
});
