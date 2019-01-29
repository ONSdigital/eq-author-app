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
    it("Should return available routable answers for given page", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [{ type: answerTypes.RADIO, label: "Radio answer" }],
              },
              {
                answers: [{ type: answerTypes.DATE, label: "Previous date" }],
              },
            ],
          },
          {
            pages: [
              {
                answers: [{ type: answerTypes.NUMBER, label: "Number answer" }],
              },
              {
                answers: [
                  { type: answerTypes.CURRENCY, label: "Currency answer" },
                ],
              },
              {
                answers: [
                  { type: answerTypes.NUMBER, label: "Future number Answer" },
                ],
              },
            ],
          },
        ],
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
          id: page.id,
        },
        ctx
      );

      expect(readResult.errors).toBeUndefined();
      const availableRoutingAnswers =
        readResult.data.questionPage.availableRoutingAnswers;
      expect(availableRoutingAnswers).toMatchObject([
        expect.objectContaining({ label: "Radio answer" }),
        expect.objectContaining({ label: "Number answer" }),
        expect.objectContaining({ label: "Currency answer" }),
      ]);
    });

    it("Should return available routing destinations for page", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            title: "Section 1",
            pages: [
              {
                title: "Page 1",
              },
            ],
          },
          {
            title: "Section 2",
            pages: [
              {
                title: "Page 2",
              },
              {
                title: "Page 3",
              },
              {
                title: "Page 4",
              },
            ],
          },
          {
            title: "Section 3",
            pages: [
              {
                title: "Page 5",
              },
            ],
          },
        ],
      });
      const page = questionnaire.sections[1].pages[1];

      const getAvailableDestinations = `
        query GetPage($id: ID!) {
          questionPage(id: $id) {
            id
            availableRoutingDestinations {
              logicalDestinations {
                id
                logicalDestination
              }
              questionPages {
                id
                title
              }
              sections {
                id
                title
              }
            }
          }
        }
      `;

      const readResult = await executeQuery(
        getAvailableDestinations,
        {
          id: page.id,
        },
        ctx
      );

      expect(readResult.errors).toBeUndefined();
      const availableRoutingDestinations =
        readResult.data.questionPage.availableRoutingDestinations;

      expect(availableRoutingDestinations.logicalDestinations).toMatchObject([
        { id: "NextPage", logicalDestination: "NextPage" },
        { id: "EndOfQuestionnaire", logicalDestination: "EndOfQuestionnaire" },
      ]);

      expect(availableRoutingDestinations.questionPages).toMatchObject([
        { title: "Page 4" },
      ]);
      expect(availableRoutingDestinations.sections).toMatchObject([
        { title: "Section 3" },
      ]);
    });
  });
});
