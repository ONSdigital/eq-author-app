const { first } = require("lodash");
const repositories = require("../../repositories");
const db = require("../../db");
const executeQuery = require("../../tests/utils/executeQuery");
const {
  createQuestionnaireMutation,
  createAnswerMutation,
  getAnswerValidations,
  toggleAnswerValidation,
  updateAnswerValidation,
  createMetadataMutation
} = require("../../tests/utils/graphql");

const {
  CUSTOM,
  PREVIOUS_ANSWER,
  METADATA,
  NOW
} = require("../../constants/validationEntityTypes");

const ctx = { repositories };

const createNewQuestionnaire = async () => {
  const input = {
    title: "Test Questionnaire",
    description: "Questionnaire created by integration test.",
    theme: "default",
    legalBasis: "Voluntary",
    navigation: false,
    surveyId: "001",
    summary: true,
    createdBy: "Integration test"
  };

  const result = await executeQuery(
    createQuestionnaireMutation,
    { input },
    ctx
  );
  return result.data.createQuestionnaire;
};

const createNewAnswer = async ({ id: pageId }, type) => {
  const input = {
    description: "",
    guidance: "",
    label: `${type} answer`,
    qCode: null,
    type: `${type}`,
    questionPageId: pageId
  };

  const result = await executeQuery(createAnswerMutation, { input }, ctx);
  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data.createAnswer;
};

const createMetadata = async questionnaireId => {
  const input = {
    questionnaireId
  };

  const result = await executeQuery(createMetadataMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data.createMetadata;
};

const queryAnswerValidations = async id => {
  const result = await executeQuery(
    getAnswerValidations,
    {
      id
    },
    ctx
  );
  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data.answer.validation;
};

const mutateValidationToggle = async input => {
  const result = await executeQuery(
    toggleAnswerValidation,
    {
      input
    },
    ctx
  );

  return result.data.toggleValidationRule;
};

const mutateValidationParameters = async input => {
  const result = await executeQuery(
    updateAnswerValidation,
    {
      input
    },
    ctx
  );
  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data.updateValidationRule;
};

describe("resolvers", () => {
  let questionnaire;
  let sections;
  let pages;
  let firstPage;

  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(() => db("Questionnaires").delete());

  beforeEach(async () => {
    questionnaire = await createNewQuestionnaire();
    sections = questionnaire.sections;
    pages = first(sections).pages;
    firstPage = first(pages);
  });

  describe("All", () => {
    it("can toggle any validation rule on and off without affecting another", async () => {
      const currencyAnswer = await createNewAnswer(firstPage, "Currency");
      let currencyValidation = await queryAnswerValidations(currencyAnswer.id);

      await mutateValidationToggle({
        id: currencyValidation.minValue.id,
        enabled: true
      });

      currencyValidation = await queryAnswerValidations(currencyAnswer.id);

      expect(currencyValidation.minValue).toHaveProperty("enabled", true);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);

      await mutateValidationToggle({
        id: currencyValidation.minValue.id,
        enabled: false
      });

      currencyValidation = await queryAnswerValidations(currencyAnswer.id);

      expect(currencyValidation.minValue).toHaveProperty("enabled", false);
      expect(currencyValidation.maxValue).toHaveProperty("enabled", false);
    });
  });

  describe("Number and Currency", () => {
    it("should create min and max validation db entries for Currency and Number answers", async () => {
      const currencyAnswer = await createNewAnswer(firstPage, "Currency");
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const numberAnswer = await createNewAnswer(firstPage, "Number");
      const numberValidation = await queryAnswerValidations(numberAnswer.id);

      const validationObject = (minValueId, maxValueId) => ({
        minValue: {
          id: minValueId,
          enabled: false,
          inclusive: false,
          custom: null
        },
        maxValue: {
          id: maxValueId,
          enabled: false,
          inclusive: false,
          custom: null,
          entityType: CUSTOM
        }
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
      const currencyAnswer = await createNewAnswer(firstPage, "Currency");
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const result = await mutateValidationParameters({
        id: currencyValidation.minValue.id,
        minValueInput: {
          custom: 10,
          inclusive: true
        }
      });
      expect(result).toMatchObject({
        id: currencyValidation.minValue.id,
        custom: 10,
        inclusive: true
      });
    });

    it("can update inclusive and custom max values", async () => {
      const currencyAnswer = await createNewAnswer(firstPage, "Currency");
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const result = await mutateValidationParameters({
        id: currencyValidation.maxValue.id,
        maxValueInput: {
          custom: 10,
          inclusive: true
        }
      });

      expect(result).toMatchObject({
        id: currencyValidation.maxValue.id,
        custom: 10,
        inclusive: true
      });
    });

    it("can update inclusive and previous answer max values", async () => {
      const previousAnswer = await createNewAnswer(firstPage, "Number");
      const currencyAnswer = await createNewAnswer(firstPage, "Currency");
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const result = await mutateValidationParameters({
        id: currencyValidation.maxValue.id,
        maxValueInput: {
          previousAnswer: previousAnswer.id,
          inclusive: true
        }
      });

      expect(result).toMatchObject({
        id: currencyValidation.maxValue.id,
        previousAnswer: {
          id: previousAnswer.id
        },
        inclusive: true
      });
    });

    it("can update inclusive and entity type", async () => {
      const currencyAnswer = await createNewAnswer(firstPage, "Currency");
      const currencyValidation = await queryAnswerValidations(
        currencyAnswer.id
      );

      const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA];

      const promises = entityTypes.map(async entityType => {
        const result = await mutateValidationParameters({
          id: currencyValidation.maxValue.id,
          maxValueInput: {
            entityType,
            inclusive: true
          }
        });

        expect(result).toMatchObject({
          id: currencyValidation.maxValue.id,
          entityType
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
          unit: "Months"
        },
        relativePosition: "After"
      };
    });

    it("should create earliest validation db entries for Date answers", async () => {
      const answer = await createNewAnswer(firstPage, "Date");
      const validation = await queryAnswerValidations(answer.id);
      const validationObject = (earliestId, latestId) => ({
        earliestDate: {
          id: earliestId,
          enabled: false,
          offset: {
            value: 0,
            unit: "Days"
          },
          relativePosition: "Before",
          custom: null
        },
        latestDate: {
          id: latestId,
          offset: {
            value: 0,
            unit: "Days"
          },
          relativePosition: "After",
          custom: null
        }
      });

      expect(validation).toMatchObject(
        validationObject(validation.earliestDate.id, validation.latestDate.id)
      );
    });

    describe("Earliest", () => {
      it("should be able to update properties", async () => {
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);
        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            custom: "2017-01-01"
          }
        });
        const expected = {
          id: validation.earliestDate.id,
          ...params,
          customDate: "2017-01-01",
          previousAnswer: null,
          metadata: null
        };
        expect(result).toEqual(expected);
      });

      it("can update previous answer", async () => {
        const previousAnswer = await createNewAnswer(firstPage, "Date");
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            entityType: PREVIOUS_ANSWER,
            previousAnswer: previousAnswer.id
          }
        });

        expect(result).toMatchObject({
          entityType: PREVIOUS_ANSWER,
          previousAnswer: {
            id: previousAnswer.id
          }
        });
      });

      it("can update metadata", async () => {
        const metadata = await createMetadata(questionnaire.id);
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.earliestDate.id,
          earliestDateInput: {
            ...params,
            entityType: METADATA,
            metadata: metadata.id
          }
        });

        expect(result).toMatchObject({
          entityType: METADATA,
          metadata: {
            id: metadata.id
          }
        });
      });

      it("can update entity type", async () => {
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        const promises = entityTypes.map(async entityType => {
          const result = await mutateValidationParameters({
            id: validation.earliestDate.id,
            earliestDateInput: {
              ...params,
              entityType
            }
          });

          expect(result).toMatchObject({
            id: validation.earliestDate.id,
            entityType
          });
        });

        await Promise.all(promises);
      });
    });

    describe("Latest", () => {
      it("should be able to update properties", async () => {
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);
        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            custom: "2017-01-01",
            ...params
          }
        });
        const expected = {
          id: validation.latestDate.id,
          customDate: "2017-01-01",
          previousAnswer: null,
          metadata: null,
          ...params
        };

        expect(result).toEqual(expected);
      });

      it("can update previous answer", async () => {
        const previousAnswer = await createNewAnswer(firstPage, "Date");
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            ...params,
            entityType: PREVIOUS_ANSWER,
            previousAnswer: previousAnswer.id
          }
        });

        expect(result).toMatchObject({
          entityType: PREVIOUS_ANSWER,
          previousAnswer: {
            id: previousAnswer.id
          }
        });
      });

      it("can update metadata", async () => {
        const metadata = await createMetadata(questionnaire.id);
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);

        const result = await mutateValidationParameters({
          id: validation.latestDate.id,
          latestDateInput: {
            ...params,
            entityType: METADATA,
            metadata: metadata.id
          }
        });

        expect(result).toMatchObject({
          entityType: METADATA,
          metadata: {
            id: metadata.id
          }
        });
      });

      it("can update entity type", async () => {
        const answer = await createNewAnswer(firstPage, "Date");
        const validation = await queryAnswerValidations(answer.id);

        const entityTypes = [CUSTOM, PREVIOUS_ANSWER, METADATA, NOW];

        const promises = entityTypes.map(async entityType => {
          const result = await mutateValidationParameters({
            id: validation.latestDate.id,
            latestDateInput: {
              ...params,
              entityType
            }
          });

          expect(result).toMatchObject({
            id: validation.latestDate.id,
            entityType
          });
        });

        await Promise.all(promises);
      });
    });
  });
});
