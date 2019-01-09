const knex = require("knex")(require("../knexfile"));
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
const answerTypes = require("../constants/answerTypes");

const AnswerRepository = require("./AnswerRepository")(knex);

describe("Answer Repository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());

  afterEach(async () => {
    await knex.transaction(async trx => {
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
        knex
      );
      secondAnswer = await AnswerRepository.insert(
        {
          questionPageId: page.id,
          type: answerTypes.TEXTFIELD
        },
        knex
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
