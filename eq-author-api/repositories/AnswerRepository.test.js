const db = require("../db");
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  db
);
const answerTypes = require("../constants/answerTypes");

const AnswerRepository = require("./AnswerRepository")(db);

describe("Answer Repository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());

  afterEach(async () => {
    await db.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  let page;
  beforeEach(async () => {
    const questionnaire = await buildTestQuestionnaire({
      sections: [
        {
          pages: [{}]
        }
      ]
    });
    page = questionnaire.sections[0].pages[0];
  });

  describe("getFirstOnPage", () => {
    let firstAnswer, secondAnswer;
    beforeEach(async () => {
      firstAnswer = await AnswerRepository.insert(
        {
          questionPageId: page.id,
          type: answerTypes.TEXTFIELD
        },
        db
      );
      secondAnswer = await AnswerRepository.insert(
        {
          questionPageId: page.id,
          type: answerTypes.TEXTFIELD
        },
        db
      );
    });

    it("should return the first answer on the page", async () => {
      const answer = await AnswerRepository.getFirstOnPage(page.id);
      expect(answer).toMatchObject(firstAnswer);
    });

    it("should ignore deleted when determing which is first", async () => {
      await AnswerRepository.remove(firstAnswer.id);
      const answer = await AnswerRepository.getFirstOnPage(page.id);
      expect(answer).toMatchObject(secondAnswer);
    });
  });
});
