const datastore = require("./datastore-mongodb");
const mockQuestionnnaire = require("./mock-questionnaire");

describe("MongoDB Datastore", () => {
  let questionnaire, baseQuestionnaire, user, ctx;

  beforeAll(async () => {
    await datastore.connectDB();
  });

  beforeEach(() => {
    questionnaire = mockQuestionnnaire();
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
      const questionnaireFromDb = await datastore.createQuestionnaire(
        questionnaire,
        ctx
      );
      expect(questionnaire.id).toBeTruthy();
      expect(questionnaireFromDb.id).toMatch(uuidRegex);
    });

    it("Should leave the questionnaire ID as is if one is given", async () => {
      expect(questionnaire.id).toBeFalsy();
      questionnaire.id = "123";
      expect(questionnaire.id).toBeTruthy();
      const questionnaireFromDb = await datastore.createQuestionnaire(
        questionnaire,
        ctx
      );
      expect(questionnaireFromDb.id).toMatch("123");
    });
  });
});
