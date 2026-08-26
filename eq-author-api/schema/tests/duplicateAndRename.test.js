const { buildContext } = require("../../tests/utils/contextBuilder");
const validateQuestionnaire = require("../../src/validation");

const {
  queryQuestionnaire,
  deleteQuestionnaire,
  duplicateAndRenameQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const { getQuestionnaire, createQuestionnaire } = require("../../db/datastore");
const { logger } = require("../../utils/logger");

jest.mock("../../db/datastore", () => {
  const actualDatastore = jest.requireActual("../../db/datastore");

  return {
    ...actualDatastore,
    createQuestionnaire: jest.fn((...argumentsList) =>
      actualDatastore.createQuestionnaire(...argumentsList)
    ),
  };
});

describe("duplicateAndRenameQuestionnaire", () => {
  let context;
  let sourceQuestionnaire;

  const questionnaireConfiguration = {
    shortTitle: "short title",
    navigation: true,
    sections: [
      {
        title: "section-title-1",
        alias: "section-alias-alias-1",
        folders: [
          {
            pages: [
              {
                title: "page-title-1",
                alias: "page-alias-alias-1",
                answers: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const createdDuplicateQuestionnaireIds = [];

  beforeEach(async () => {
    context = await buildContext(questionnaireConfiguration);
    sourceQuestionnaire = await queryQuestionnaire(context);
  });

  afterEach(async () => {
    for (const questionnaireId of createdDuplicateQuestionnaireIds) {
      const duplicatedQuestionnaireRecord = await getQuestionnaire(
        questionnaireId
      );

      if (duplicatedQuestionnaireRecord) {
        const cleanupContext = {
          questionnaire: duplicatedQuestionnaireRecord,
          user: context.user,
          validationErrorInfo: validateQuestionnaire(duplicatedQuestionnaireRecord),
        };

        await deleteQuestionnaire(cleanupContext, questionnaireId);
      }
    }

    createdDuplicateQuestionnaireIds.length = 0;
    await deleteQuestionnaire(context, context.questionnaire.id);
    jest.clearAllMocks();
  });

  it("should use supplied title and shortTitle when both are provided", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      {
        title: "My Title",
        shortTitle: "my-short",
      }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.title).toEqual("My Title");
    expect(duplicatedQuestionnaire.shortTitle).toEqual("my-short");
  });

  it("should apply default prefixes when only id is provided", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.title).toEqual(
      `Copy of ${sourceQuestionnaire.title}`
    );
    expect(duplicatedQuestionnaire.shortTitle).toEqual(
      `Copy of ${sourceQuestionnaire.shortTitle}`
    );
  });

  it("should throw when supplied title is an empty string", async () => {
    await expect(
      duplicateAndRenameQuestionnaire(context, { title: "" })
    ).rejects.toThrow("title must be a non-empty string.");
  });

  it("should throw when supplied title is whitespace only", async () => {
    await expect(
      duplicateAndRenameQuestionnaire(context, { title: "   " })
    ).rejects.toThrow("title must be a non-empty string.");
  });

  it("should reject when supplied title is not a string", async () => {
    await expect(
      duplicateAndRenameQuestionnaire(context, { title: 123 })
    ).rejects.toThrow("Expected type String");
  });

  it("should apply default prefix to shortTitle when only title is supplied", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      { title: "Only Title" }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.title).toEqual("Only Title");
    expect(duplicatedQuestionnaire.shortTitle).toEqual(
      `Copy of ${sourceQuestionnaire.shortTitle}`
    );
  });

  it("should apply default prefix to title when only shortTitle is supplied", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      { shortTitle: "only-short" }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.title).toEqual(
      `Copy of ${sourceQuestionnaire.title}`
    );
    expect(duplicatedQuestionnaire.shortTitle).toEqual("only-short");
  });

  it("should succeed when shortTitle is supplied as an empty string", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      { shortTitle: "" }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.shortTitle).toEqual("");
  });

  it("should treat explicit null title as omitted and apply default prefix", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      { title: null }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.title).toEqual(
      `Copy of ${sourceQuestionnaire.title}`
    );
  });

  it("should treat explicit null shortTitle as omitted and apply default prefix", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      { shortTitle: null }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.shortTitle).toEqual(
      `Copy of ${sourceQuestionnaire.shortTitle}`
    );
  });

  it("should return the duplicate with the correct title without a separate update call", async () => {
    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      { title: "Final Title" }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(duplicatedQuestionnaire.title).toEqual("Final Title");

    const duplicatedQuestionnaireRecord = await getQuestionnaire(
      duplicatedQuestionnaire.id
    );

    expect(duplicatedQuestionnaireRecord.title).toEqual("Final Title");
  });

  it("should reject duplication when the caller is unauthenticated", async () => {
    const unauthenticatedContext = { ...context, user: null };

    await expect(
      duplicateAndRenameQuestionnaire(unauthenticatedContext, {
        title: "Should Not Be Created",
      })
    ).rejects.toThrow();
  });

  it("should reject duplication without custom naming when the caller is unauthenticated", async () => {
    const unauthenticatedContext = { ...context, user: null };

    await expect(
      duplicateAndRenameQuestionnaire(unauthenticatedContext)
    ).rejects.toThrow();
  });

  it("should log source and new questionnaire IDs on successful duplication", async () => {
    const infoLoggerSpy = jest.spyOn(logger, "info");

    const duplicatedQuestionnaire = await duplicateAndRenameQuestionnaire(
      context,
      { title: "Logged Title" }
    );

    createdDuplicateQuestionnaireIds.push(duplicatedQuestionnaire.id);

    expect(infoLoggerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceQuestionnaireId: context.questionnaire.id,
        duplicatedQuestionnaireId: duplicatedQuestionnaire.id,
        hasCustomTitle: true,
        hasCustomShortTitle: false,
      }),
      expect.stringContaining("Duplicated questionnaire")
    );

    infoLoggerSpy.mockRestore();
  });

  it("should log the source questionnaire ID when duplication fails and re-throw the error", async () => {
    const datastoreFailure = new Error("Simulated DB failure");
    createQuestionnaire.mockRejectedValueOnce(datastoreFailure);

    const errorLoggerSpy = jest.spyOn(logger, "error");

    await expect(
      duplicateAndRenameQuestionnaire(context, { title: "Will Fail" })
    ).rejects.toThrow("Simulated DB failure");

    expect(errorLoggerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceQuestionnaireId: context.questionnaire.id,
        hasCustomTitle: true,
        hasCustomShortTitle: false,
      }),
      expect.stringContaining("Failed to duplicate questionnaire")
    );

    errorLoggerSpy.mockRestore();
  });
});

