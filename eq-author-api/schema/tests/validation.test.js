const { last } = require("lodash");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  createAnswer,
  updateAnswer,
} = require("../../tests/utils/contextBuilder/answer");

const { createMetadata } = require("../../tests/utils/contextBuilder/metadata");

const {
  queryValidation,
  toggleValidation,
  updateValidation,
} = require("../../tests/utils/contextBuilder/validation");

const { queryPage } = require("../../tests/utils/contextBuilder/page");

const {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA,
  NOW,
} = require("../../constants/validationEntityTypes");

const { PAGES } = require("../../constants/validationErrorTypes");

const {
  CURRENCY,
  NUMBER,
  DATE,
  DATE_RANGE,
  UNIT,
} = require("../../constants/answerTypes");
const METADATA_TYPES = require("../../constants/metadataTypes");

describe("validation", () => {
  let ctx, questionnaire, section, page;
  let config = {
    metadata: [{ type: METADATA_TYPES.DATE }, { type: METADATA_TYPES.REGION }],
    sections: [
      {
        pages: [
          {
            answers: [{ type: DATE }, { type: CURRENCY }, { type: UNIT }],
          },
        ],
      },
      {
        pages: [{}],
      },
    ],
  };

  beforeAll(async () => {
    ctx = await buildContext(config);
    questionnaire = ctx.questionnaire;
    section = last(questionnaire.sections);
    page = last(section.pages);
  });

  afterAll(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("Page validation", () => {
    it("contains validation error info when querying page", async () => {
      const validationErrorInfo = [
        {
          id: page.id,
          type: PAGES,
          field: "field",
          errorCode: "ERR_CODE",
        },
      ];

      const queriedPage = await queryPage(
        { questionnaire, validationErrorInfo },
        page.id
      );

      expect(queriedPage.validationErrorInfo.totalCount).toEqual(1);
    });
  });

  describe("All", () => {
    it("can toggle any validation rule on and off without affecting another", async () => {
      const currencyAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: CURRENCY,
      });

      let currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      await toggleValidation(ctx, {
        id: currencyValidation.minValue.id,
        enabled: true,
      });

      currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      expect(currencyValidation.minValue).toHaveProperty("enabled", true);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);

      await toggleValidation(ctx, {
        id: currencyValidation.minValue.id,
        enabled: false,
      });

      currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      expect(currencyValidation.minValue).toHaveProperty("enabled", false);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);
    });

    it("provides a list of available previous answers", async () => {
      const currencyAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidations = await queryValidation(ctx, currencyAnswer.id);

      expect(currencyValidations.minValue.availablePreviousAnswers).toEqual([
        { id: questionnaire.sections[0].pages[0].answers[1].id },
      ]);
    });
  });

  describe("Number and Currency", () => {
    it("should create min and max validation for Currency and Number answers", async () => {
      const currencyAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      const numberAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberValidation = await queryValidation(ctx, numberAnswer.id);

      const validationObject = (minValueId, maxValueId) => ({
        minValue: {
          id: minValueId,
          enabled: false,
          inclusive: false,
          custom: null,
          entityType: CUSTOM,
          availablePreviousAnswers: expect.any(Array),
        },
        maxValue: {
          id: maxValueId,
          enabled: false,
          inclusive: false,
          custom: null,
          entityType: CUSTOM,
          availablePreviousAnswers: expect.any(Array),
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
      const currencyAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      const result = await updateValidation(ctx, {
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
      const currencyAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      const result = await updateValidation(ctx, {
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
      const previousAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberValidation = await queryValidation(ctx, numberAnswer.id);

      const result = await updateValidation(ctx, {
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
      const previousAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: NUMBER,
      });
      const numberValidation = await queryValidation(ctx, numberAnswer.id);

      const result = await updateValidation(ctx, {
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
      const currencyAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA];

      for (let i = 0; i < entityTypes.length; i++) {
        const result = await updateValidation(ctx, {
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
        const result = await updateValidation(ctx, {
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

  describe("Unit", () => {
    it("should not show units of different unit types when selecting previous answer validation", async () => {
      const answer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: UNIT,
      });
      answer.properties = { unit: "Miles" };

      await updateAnswer(ctx, answer);

      const validation = await queryValidation(ctx, answer.id);
      expect(validation.minValue.availablePreviousAnswers).toHaveLength(0);
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
      const answer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: DATE,
      });
      const validation = await queryValidation(ctx, answer.id);
      expect(validation.earliestDate.entityType).toEqual(NOW);
      expect(validation.latestDate.entityType).toEqual(NOW);
    });

    it("should create earliest validation for Date answers", async () => {
      const answer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: DATE,
      });
      const validation = await queryValidation(ctx, answer.id);
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

    it("should return a list of available metadata", async () => {
      const answer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: DATE,
      });
      const validation = await queryValidation(ctx, answer.id);
      expect(validation.earliestDate.availableMetadata).toEqual([
        { id: questionnaire.metadata[0].id },
      ]);
      expect(validation.latestDate.availableMetadata).toEqual([
        { id: questionnaire.metadata[0].id },
      ]);
    });

    describe("Earliest", () => {
      it("should be able to update properties", async () => {
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);
        const result = await updateValidation(ctx, {
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
        const previousAnswer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const result = await updateValidation(ctx, {
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
        const metadata = await createMetadata(ctx, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);
        const result = await updateValidation(ctx, {
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
        const previousAnswer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const result = await updateValidation(ctx, {
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
        const metadata = await createMetadata(ctx, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(ctx, {
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
      const answer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: DATE_RANGE,
      });
      const validation = await queryValidation(ctx, answer.id);

      expect(validation.earliestDate.entityType).toEqual(CUSTOM);
      expect(validation.latestDate.entityType).toEqual(CUSTOM);
    });

    it("should create earliest validation for DateRange answers", async () => {
      const answer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: DATE_RANGE,
      });
      const validation = await queryValidation(ctx, answer.id);
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);
        const result = await updateValidation(ctx, {
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
        const metadata = await createMetadata(ctx, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const entityTypes = [CUSTOM, METADATA];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);
        const result = await updateValidation(ctx, {
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
        const metadata = await createMetadata(ctx, {
          questionnaireId: questionnaire.id,
        });
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);

        const entityTypes = [CUSTOM, METADATA];

        for (let i = 0; i < entityTypes.length; i++) {
          const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);
        const input = {
          duration: {
            value: 8,
            unit: "Days",
          },
        };
        const result = await updateValidation(ctx, {
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
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE_RANGE,
        });
        const validation = await queryValidation(ctx, answer.id);
        const input = {
          duration: {
            value: 8,
            unit: "Days",
          },
        };
        const result = await updateValidation(ctx, {
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
