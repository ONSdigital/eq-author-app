const { createQuestionnaire } = require("./datastore-firestore");
const { v4: uuidv4 } = require("uuid");

jest.mock("@google-cloud/firestore", () => {
  class Firestore {
    constructor(projectId) {
      this.projectId = projectId;
    }
  }

  Firestore.prototype = {};
  Firestore.prototype.collection = jest.fn(() => new Firestore());
  Firestore.prototype.doc = jest.fn(() => new Firestore());
  Firestore.prototype.set = jest.fn(() => new Firestore());

  return {
    Firestore,
  };
});

describe("Firestore Datastore", () => {
  let questionnaire, ctx;
  beforeEach(() => {
    questionnaire = {
      title: "Working from home",
      theme: "default",
      legalBasis: "Voluntary",
      navigation: false,
      createdAt: new Date(),
      metadata: [],
      sections: [
        {
          id: uuidv4(),
          title: "",
          introductionEnabled: false,
          pages: [
            {
              id: uuidv4(),
              pageType: "QuestionPage",
              title: "",
              description: "",
              descriptionEnabled: false,
              guidanceEnabled: false,
              definitionEnabled: false,
              additionalInfoEnabled: false,
              answers: [],
              routing: null,
              alias: null,
            },
          ],
          alias: "",
        },
      ],
      summary: false,
      version: 13,
      surveyVersion: 1,
      editors: [],
      isPublic: true,
      publishStatus: "Unpublished",
    };

    ctx = {
      user: {
        id: 123,
      },
    };
  });

  describe("Creating a questionnaire", () => {
    it("Should give the questionnaire an ID if one is not given", async () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(questionnaire.id).toBeFalsy();
      const questionnaireFromDb = await createQuestionnaire(questionnaire, ctx);
      expect(questionnaire.id).toBeTruthy();
      expect(questionnaireFromDb.id).toMatch(uuidRegex);
    });

    it("Should leave the questionnaire ID as is if one is given", async () => {
      expect(questionnaire.id).toBeFalsy();
      questionnaire.id = "123";
      expect(questionnaire.id).toBeTruthy();
      const questionnaireFromDb = await createQuestionnaire(questionnaire, ctx);
      expect(questionnaireFromDb.id).toMatch("123");
    });
  });
});
