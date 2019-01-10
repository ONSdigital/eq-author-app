const knex = require("knex")(require("../../../knexfile"));
const executeQuery = require("../../../tests/utils/executeQuery");
const buildTestQuestionnaire = require("../../../tests/utils/buildTestQuestionnaire")(
  knex
);
const repositories = require("../../../repositories")(knex);
const modifiers = require("../../../modifiers")(repositories);
const answerTypes = require("../../../constants/answerTypes");

const ctx = { repositories, modifiers };

describe("answer", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });
  describe("routing", () => {
    it("should update all LeftSides for existing Rules on the Page when it is the first Answer for the Page", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [{ type: answerTypes.RADIO, label: "Radio answer" }]
              },
              {
                answers: [{ type: answerTypes.DATE, label: "Previous date" }]
              }
            ]
          },
          {
            pages: [
              {
                answers: [{ type: answerTypes.NUMBER, label: "Number answer" }]
              },
              {
                answers: [
                  { type: answerTypes.CURRENCY, label: "Currency answer" }
                ]
              },
              {
                answers: [
                  { type: answerTypes.NUMBER, label: "Future number Answer" }
                ]
              }
            ]
          }
        ]
      });
      const page = questionnaire.sections[1].pages[1];

      const createAnswerMutation = `
        query GetPage($id: ID!) {
          questionPage(id: $id) {
            id
            availableRoutingAnswers {
              id
              label
            }
          }
        }
      `;

      const readResult = await executeQuery(
        createAnswerMutation,
        {
          id: page.id
        },
        ctx
      );

      expect(readResult.errors).toBeUndefined();
      const availableRoutingAnswers =
        readResult.data.questionPage.availableRoutingAnswers;
      expect(availableRoutingAnswers).toMatchObject([
        expect.objectContaining({ label: "Radio answer" }),
        expect.objectContaining({ label: "Number answer" }),
        expect.objectContaining({ label: "Currency answer" })
      ]);
    });
  });
});
