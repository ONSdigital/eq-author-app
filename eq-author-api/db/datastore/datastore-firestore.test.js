const { defineFeature, loadFeature } = require("jest-cucumber");
const { createQuestionnaire } = require("./datastore-firestore");
const { v4: uuidv4 } = require("uuid");

const creatingAQuestionnaire = loadFeature(
  "./features/createQuestionnaire.feature"
);

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

defineFeature(creatingAQuestionnaire, test => {
  beforeEach(() => {});

  test("Questionnaire without an ID", ({ given, when, then, and }) => {
    let questionnaire, questionnaireFromDb;
    given(
      "I am a developer attempting to programatically create a new questionnaire within the database",
      () => {
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
      }
    );
    and("I have not assigned an ID to the questionnaire", () => {
      expect(questionnaire.id).toBeFalsy();
    });
    when(
      "I use the createQuestionnaire method from the Firestore datastore",
      async () => {
        questionnaireFromDb = await createQuestionnaire(questionnaire, {
          user: {
            id: 123,
          },
        });
      }
    );
    then("The method should give my questionnaire a new ID", () => {
      expect(questionnaireFromDb.id).toBeTruthy();
    });
    and("the ID should be a UUID", () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(questionnaireFromDb.id).toMatch(uuidRegex);
    });
    and("the questionnaire should save within the database", () => {});
  });
});
