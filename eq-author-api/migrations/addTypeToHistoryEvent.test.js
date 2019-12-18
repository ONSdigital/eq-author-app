const { cloneDeep } = require("lodash");
const addTypeToHistoryEvent = require("./addTypeToHistoryEvent.js");

describe("addTypeToHistoryEvent", () => {
  let questionnaire, historyEvent, noteEvent, creationEvent;
  const questionnaireId = "aca64645-98ef-43ae-8b77-d749b4e89a05";

  beforeEach(async () => {
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
    noteEvent = {
      id: "fdfsdfds-sdfsdf-dfdsf-dsfdsf",
      bodyText: "Some note..",
      questionnaireTitle: `This is a test`,
      userId: "12345",
      time: new Date(),
    };
    questionnaire = {
      id: questionnaireId,
      history: [creationEvent, historyEvent, noteEvent],
    };
  });

  it("should be deterministic", () => {
    expect(addTypeToHistoryEvent(cloneDeep(questionnaire))).toEqual(
      addTypeToHistoryEvent(cloneDeep(questionnaire))
    );
  });

  it("should add system type when there is no body text", async () => {
    await addTypeToHistoryEvent(questionnaire);

    expect(questionnaire.history[0].type).toBe("system");
  });

  it("should add note type when there is body text", async () => {
    await addTypeToHistoryEvent(questionnaire);

    expect(questionnaire.history[2].type).toBe("note");
  });

  it("should not change type when it already exists", async () => {
    questionnaire.history[1] = {
      ...historyEvent,
      bodyText: "Some note..",
      type: "note",
    };

    await addTypeToHistoryEvent(questionnaire);

    expect(questionnaire.history[0].type).toBe("system");
    expect(questionnaire.history[1].type).toBe("note");
  });

  it("should work with multiple history items", async () => {
    questionnaire.history = [
      creationEvent,
      { ...historyEvent, bodyText: "Some note.." },
      { ...historyEvent, type: "testType" },
    ];

    await addTypeToHistoryEvent(questionnaire);
    expect(questionnaire.history[0].type).toBe("system");
    expect(questionnaire.history[1].type).toBe("note");
    expect(questionnaire.history[2].type).toBe("testType");
  });
});
