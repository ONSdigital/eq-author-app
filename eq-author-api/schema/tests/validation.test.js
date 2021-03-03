const { last } = require("lodash");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const { createAnswer } = require("../../tests/utils/contextBuilder/answer");

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

const {
  CURRENCY,
  NUMBER,
  DATE,
  DATE_RANGE,
  UNIT,
} = require("../../constants/answerTypes");
const METADATA_TYPES = require("../../constants/metadataTypes");
const {
  ERR_EARLIEST_AFTER_LATEST,
} = require("../../constants/validationErrorCodes.js");

describe("validation", () => {
  let ctx, questionnaire, section, folder, page;
  let config = {
    metadata: [{ type: METADATA_TYPES.DATE }, { type: METADATA_TYPES.REGION }],
    sections: [
      {
        folders: [
          {
            pages: [
              {
                answers: [
                  { type: DATE },
                  { type: CURRENCY },
                  { type: UNIT },
                  { type: DATE_RANGE },
                ],
              },
            ],
          },
        ],
      },
      {
        folders: [
          {
            pages: [{}],
          },
        ],
      },
    ],
  };

  beforeAll(async () => {
    ctx = await buildContext(config);
    questionnaire = ctx.questionnaire;
    section = last(questionnaire.sections);
    folder = last(section.folders);
    page = last(folder.pages);
  });

  afterAll(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("Page validation", () => {
    it("contains validation error info when querying page", async () => {
      const queriedPage = await queryPage(ctx, page.id);
      expect(queriedPage.validationErrorInfo.totalCount).toEqual(
        expect.any(Number)
      );
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
          inclusive: true,
          custom: null,
          entityType: CUSTOM,
        },
        maxValue: {
          id: maxValueId,
          enabled: false,
          inclusive: true,
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
      const currencyAnswer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: CURRENCY,
      });
      const currencyValidation = await queryValidation(ctx, currencyAnswer.id);

      const result = await updateValidation(ctx, {
        id: currencyValidation.minValue.id,
        minValueInput: {
          custom: 10,
          inclusive: false,
        },
      });
      expect(result).toMatchObject({
        id: currencyValidation.minValue.id,
        custom: 10,
        inclusive: false,
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
          inclusive: false,
        },
      });

      expect(result).toMatchObject({
        id: currencyValidation.maxValue.id,
        custom: 10,
        inclusive: false,
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
          inclusive: false,
        },
      });

      expect(result).toMatchObject({
        id: numberValidation.minValue.id,
        previousAnswer: {
          id: previousAnswer.id,
        },
        inclusive: false,
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
          inclusive: false,
        },
      });

      expect(result).toMatchObject({
        id: numberValidation.maxValue.id,
        previousAnswer: {
          id: previousAnswer.id,
        },
        inclusive: false,
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
            inclusive: false,
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
            inclusive: false,
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

    describe("schema validation", () => {
      it("should return validation error when latest date is before earliest date", async () => {
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const validation = await queryValidation(ctx, answer.id);
        await toggleValidation(ctx, {
          id: validation.earliestDate.id,
          enabled: true,
        });
        await toggleValidation(ctx, {
          id: validation.latestDate.id,
          enabled: true,
        });
        await updateValidation(ctx, {
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            custom: "2017-01-06",
          },
        });
        await updateValidation(ctx, {
          id: validation.latestDate.id,
          latestDateInput: {
            ...params,
            custom: "2017-01-05",
          },
        });
        const result = await queryValidation(ctx, answer.id);

        expect(
          result.earliestDate.validationErrorInfo.errors[0].errorCode
        ).toBe(ERR_EARLIEST_AFTER_LATEST);
      });
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
            value: null,
            unit: "Days",
          },
          relativePosition: "Before",
          custom: null,
        },
        latestDate: {
          id: latestId,
          offset: {
            value: null,
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
        jest.setTimeout(60000);
        const previousAnswer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });
        const answer = await createAnswer(ctx, {
          questionPageId: page.id,
          type: DATE,
        });

        const validation = await queryValidation(ctx, answer.id);

        await expect(
          updateValidation(ctx, {
            id: validation.earliestDate.id,
            earliestDateInput: {
              ...params,
              entityType: PREVIOUS_ANSWER,
              previousAnswer: previousAnswer.id,
            },
          })
        ).resolves.toEqual({
          id: validation.earliestDate.id,
          offset: { value: 8, unit: "Months" },
          entityType: PREVIOUS_ANSWER,
          customDate: null,
          relativePosition: "After",
          previousAnswer: {
            id: previousAnswer.id,
          },
          metadata: null,
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
          value: 0,
          unit: "Days",
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
            value: null,
            unit: "Days",
          },
          relativePosition: "Before",
          custom: null,
        },
        latestDate: {
          id: latestId,
          offset: {
            value: null,
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

    it("should create minimum validation for DateRange answers", async () => {
      const answer = await createAnswer(ctx, {
        questionPageId: page.id,
        type: DATE_RANGE,
      });
      const validation = await queryValidation(ctx, answer.id);
      const validationObject = (minimumId, maximumId) => ({
        minDuration: {
          id: minimumId,
          enabled: false,
          duration: {
            value: null,
            unit: "Days",
          },
        },
        maxDuration: {
          id: maximumId,
          enabled: false,
          duration: {
            value: null,
            unit: "Days",
          },
        },
      });
      expect(validation).toMatchObject(
        validationObject(validation.minDuration.id, validation.maxDuration.id)
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

    describe("Duration", () => {
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
});
