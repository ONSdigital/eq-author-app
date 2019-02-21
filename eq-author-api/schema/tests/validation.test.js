const { last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  createAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

const {
  createMetadata,
} = require("../../tests/utils/questionnaireBuilder/metadata");

const {
  queryValidation,
  toggleValidation,
  updateValidation,
} = require("../../tests/utils/questionnaireBuilder/validation");

const {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA,
  NOW,
} = require("../../constants/validationEntityTypes");

const {
  CURRENCY,
  NUMBER,
  DATE,
  DATE_RANGE,
} = require("../../constants/answerTypes");

describe("validation", () => {
  let questionnaire, section, page;
  let config = {
    sections: [
      {
        pages: [{}],
      },
    ],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
    page = last(section.pages);
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("All", () => {
    it("can toggle any validation rule on and off without affecting another", async () => {
      const currencyAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: CURRENCY,
      });

      let currencyValidation = await queryValidation(
        questionnaire,
        currencyAnswer.id
      );

      await toggleValidation(questionnaire, {
        id: currencyValidation.minValue.id,
        enabled: true,
      });

      currencyValidation = await queryValidation(
        questionnaire,
        currencyAnswer.id
      );

      expect(currencyValidation.minValue).toHaveProperty("enabled", true);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);

      await toggleValidation(questionnaire, {
        id: currencyValidation.minValue.id,
        enabled: false,
      });

      currencyValidation = await queryValidation(
        questionnaire,
        currencyAnswer.id
      );

      expect(currencyValidation.minValue).toHaveProperty("enabled", false);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);
    });
  });

  describe("Number and Currency", () => {
    it("should create min and max validation for Currency and Number answers", async () => {
      const currencyAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(
        questionnaire,
        currencyAnswer.id
      );

      const numberAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberValidation = await queryValidation(
        questionnaire,
        numberAnswer.id
      );

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
      const currencyAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(
        questionnaire,
        currencyAnswer.id
      );

      const result = await updateValidation(questionnaire, {
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
      const currencyAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(
        questionnaire,
        currencyAnswer.id
      );

      const result = await updateValidation(questionnaire, {
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
      const previousAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberValidation = await queryValidation(
        questionnaire,
        numberAnswer.id
      );

      const result = await updateValidation(questionnaire, {
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
      const previousAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberValidation = await queryValidation(
        questionnaire,
        numberAnswer.id
      );

      const result = await updateValidation(questionnaire, {
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
      const currencyAnswer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(
        questionnaire,
        currencyAnswer.id
      );

      const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA];

      for (let i = 0; i < entityTypes.length; i++) {
        const result = await updateValidation(questionnaire, {
          id: currencyValidation.minValue.id,
          minValueInput: {
            entityType: entityTypes[i],
            inclusive: true,
          },
        });

        expect(result).toMatchObject({
          id: currencyValidation.minValue.id,
          entityType: entityTypes[i],
        });
      }

      for (let i = 0; i < entityTypes.length; i++) {
        const result = await updateValidation(questionnaire, {
          id: currencyValidation.maxValue.id,
          maxValueInput: {
            entityType: entityTypes[i],
            inclusive: true,
          },
        });

        expect(result).toMatchObject({
          id: currencyValidation.maxValue.id,
          entityType: entityTypes[i],
        });
      }
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
      const answer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: DATE,
      });
      const validation = await queryValidation(questionnaire, answer.id);
      expect(validation.earliestDate.entityType).toEqual(NOW);
      expect(validation.latestDate.entityType).toEqual(NOW);
    });

    it("should create earliest validation for Date answers", async () => {
      const answer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: DATE,
      });
      const validation = await queryValidation(questionnaire, answer.id);
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
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);
        const result = await updateValidation(questionnaire, {
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
        const previousAnswer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const result = await updateValidation(questionnaire, {
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
        const metadata = await createMetadata(questionnaire, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const result = await updateValidation(questionnaire, {
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
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(questionnaire, {
            id: validation.earliestDate.id,
            earliestDateInput: {
              ...params,
              entityType: entityTypes[i],
            },
          });

          expect(result).toMatchObject({
            id: validation.earliestDate.id,
            entityType: entityTypes[i],
          });
        }
      });
    });

    describe("Latest", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);
        const result = await updateValidation(questionnaire, {
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
        const previousAnswer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const result = await updateValidation(questionnaire, {
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
        const metadata = await createMetadata(questionnaire, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const result = await updateValidation(questionnaire, {
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
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(questionnaire, {
            id: validation.latestDate.id,
            latestDateInput: {
              ...params,
              entityType: entityTypes[i],
            },
          });

          expect(result).toMatchObject({
            id: validation.latestDate.id,
            entityType: entityTypes[i],
          });
        }
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
      const answer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: DATE_RANGE,
      });
      const validation = await queryValidation(questionnaire, answer.id);

      expect(validation.earliestDate.entityType).toEqual(CUSTOM);
      expect(validation.latestDate.entityType).toEqual(CUSTOM);
    });

    it("should create earliest validation for DateRange answers", async () => {
      const answer = await createAnswer(questionnaire, {
        questionPageId: page.id,
        type: DATE_RANGE,
      });
      const validation = await queryValidation(questionnaire, answer.id);
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
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);
        const result = await updateValidation(questionnaire, {
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
        const metadata = await createMetadata(questionnaire, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const result = await updateValidation(questionnaire, {
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
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const entityTypes = [CUSTOM, METADATA];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(questionnaire, {
            id: validation.earliestDate.id,
            earliestDateInput: {
              ...params,
              entityType: entityTypes[i],
            },
          });

          expect(result).toMatchObject({
            id: validation.earliestDate.id,
            entityType: entityTypes[i],
          });
        }
      });
    });

    describe("Latest", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);
        const result = await updateValidation(questionnaire, {
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
        const metadata = await createMetadata(questionnaire, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const result = await updateValidation(questionnaire, {
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
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);

        const entityTypes = [CUSTOM, METADATA];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(questionnaire, {
            id: validation.latestDate.id,
            latestDateInput: {
              ...params,
              entityType: entityTypes[i],
            },
          });

          expect(result).toMatchObject({
            id: validation.latestDate.id,
            entityType: entityTypes[i],
          });
        }
      });
    });

    describe("MinDuration", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);
        const input = {
          duration: {
            value: 8,
            unit: "Days",
          },
        };
        const result = await updateValidation(questionnaire, {
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
        const answer = await createAnswer(questionnaire, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(questionnaire, answer.id);
        const input = {
          duration: {
            value: 8,
            unit: "Days",
          },
        };
        const result = await updateValidation(questionnaire, {
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
