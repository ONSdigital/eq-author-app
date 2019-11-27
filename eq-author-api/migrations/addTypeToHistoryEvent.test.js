const { cloneDeep } = require("lodash");
const addTypeToHistoryEvent = require("./addTypeToHistoryEvent.js");

const { getQuestionnaireMetaById, saveModel } = require("../utils/datastore");
const { QuestionnaireModel } = require("../db/models/DynamoDB");

describe("addTypeToHistoryEvent", () => {
  let questionnaire, historyEvent, metadata, creationEvent;
  const questionnaireId = "aca64645-98ef-43ae-8b77-d749b4e89a05";

  beforeEach(async () => {
    questionnaire = { id: questionnaireId };
    creationEvent = {
      id: "123",
      publishStatus: "Questionnaire created",
      questionnaireTitle: `Test questionnaire (Version 1)`,
      userId: "user-123",
      time: 1574682388976,
    };
    historyEvent = {
      id: "fdfsdfds-sdfsdf-dfdsf-dsfdsf",
      publishStatus: "Published",
      questionnaireTitle: `This is a test`,
      userId: "12345",
      time: new Date(),
    };
    metadata = {
      id: questionnaireId,
      isPublic: true,
      createdAt: 1574682388976,
      updatedAt: 1574682388976,
      type: "Social",
      history: [creationEvent],
    };

    await saveModel(new QuestionnaireModel(metadata));
  });

  it("should be deterministic", () => {
    expect(addTypeToHistoryEvent(cloneDeep(questionnaire))).toEqual(
      addTypeToHistoryEvent(cloneDeep(questionnaire))
    );
  });

  it("should add system type when there is no body text", async () => {
    metadata.history[1] = historyEvent;

    const createdMetadata = await saveModel(new QuestionnaireModel(metadata));
    expect(createdMetadata.history[1].type).toBeUndefined();

    await addTypeToHistoryEvent(questionnaire);

    const migratedMetadata = await getQuestionnaireMetaById(questionnaireId);
    expect(migratedMetadata.history[0].type).toBe("system");
  });

  it("should add note type when there is body text", async () => {
    metadata.history[1] = { ...historyEvent, bodyText: "Some note.." };

    const createdMetadata = await saveModel(new QuestionnaireModel(metadata));
    expect(createdMetadata.history[1].type).toBeUndefined();

    await addTypeToHistoryEvent(questionnaire);

    const migratedMetadata = await getQuestionnaireMetaById(questionnaireId);
    expect(migratedMetadata.history[1].type).toBe("note");
  });

  it("should not change type when it already exists", async () => {
    metadata.history[1] = {
      ...historyEvent,
      bodyText: "Some note..",
      type: "note",
    };

    const createdMetadata = await saveModel(new QuestionnaireModel(metadata));
    expect(createdMetadata.history[1].type).toBe("note");

    await addTypeToHistoryEvent(questionnaire);

    const migratedMetadata = await getQuestionnaireMetaById(questionnaireId);
    expect(migratedMetadata.history[0].type).toBe("system");
    expect(migratedMetadata.history[1].type).toBe("note");
  });

  it("should work with multiple history items", async () => {
    metadata.history = [
      creationEvent,
      { ...historyEvent, bodyText: "Some note.." },
      { ...historyEvent, type: "testType" },
    ];

    await saveModel(new QuestionnaireModel(metadata));

    await addTypeToHistoryEvent(questionnaire);

    const migratedMetadata = await getQuestionnaireMetaById(questionnaireId);
    expect(migratedMetadata.history[0].type).toBe("system");
    expect(migratedMetadata.history[1].type).toBe("note");
    expect(migratedMetadata.history[2].type).toBe("testType");
  });
});
