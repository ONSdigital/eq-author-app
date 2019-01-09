const knex = require("knex")(require("../../../../knexfile"));
const executeQuery = require("../../../../tests/utils/executeQuery");
const buildTestQuestionnaire = require("../../../../tests/utils/buildTestQuestionnaire")(
  knex
);
const repositories = require("../../../../repositories")(knex);
const modifiers = require("../../../../modifiers")(repositories);
const answerTypes = require("../../../../constants/answerTypes");

const ctx = { repositories, modifiers };

describe("Routing Integration", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  describe("create", () => {
    it("should create a Routing2", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: answerTypes.NUMBER
                  }
                ]
              }
            ]
          }
        ]
      });
      const createMutation = `
        mutation createRouting2($input: CreateRouting2Input!) {
          createRouting2(input: $input) {
            id
            page {
              id
            }
          }
        }`;
      const page = questionnaire.sections[0].pages[0];
      const pageId = page.id;
      const input = {
        pageId
      };
      const createResult = await executeQuery(createMutation, { input }, ctx);
      expect(createResult.errors).toBeUndefined();
      expect(createResult.data).toMatchObject({
        createRouting2: {
          id: expect.any(String),
          page: { id: pageId.toString() }
        }
      });

      const query = `
        query($pageId: ID!) {
          page(id: $pageId) {
            ... on QuestionPage {
              routing {
                id
                page {
                  id
                }
                else {
                  ...Destination2
                }
                rules {
                  id
                  destination {
                    ...Destination2
                  }
                  expressionGroup {
                    id
                    operator
                    expressions {
                      ... on BinaryExpression2 {
                        id
                        left {
                          ... on BasicAnswer {
                            id
                          }
                        }
                        condition
                        right {
                          ... on BasicAnswer {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
  
        fragment Destination2 on Destination2 {
          id
          page {
            id
          }
          section {
            id
          }
          logical
        }
      `;

      const readResult = await executeQuery(query, { pageId }, ctx);
      expect(readResult.errors).toBeUndefined();
      expect(readResult.data).toMatchObject({
        page: {
          routing: {
            id: createResult.data.createRouting2.id,
            page: { id: pageId.toString() },
            else: {
              id: expect.any(String),
              logical: "NextPage",
              page: null,
              section: null
            },
            rules: [
              {
                id: expect.any(String),
                destination: {
                  id: expect.any(String),
                  logical: "NextPage",
                  page: null,
                  section: null
                },
                expressionGroup: {
                  id: expect.any(String),
                  operator: "And",
                  expressions: [
                    {
                      id: expect.any(String),
                      left: {
                        id: page.answers[0].id.toString()
                      },
                      condition: "Equal",
                      right: null
                    }
                  ]
                }
              }
            ]
          }
        }
      });
    });

    it("should throw error when a attempting to create a second routing on a page", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [{}],
                routing: {}
              }
            ]
          }
        ]
      });

      const createMutation = `
      mutation createRouting2($input: CreateRouting2Input!) {
        createRouting2(input: $input) {
          id
        }
      }`;
      const page = questionnaire.sections[0].pages[0];
      const pageId = page.id;
      const input = {
        pageId
      };
      const createResult = await executeQuery(createMutation, { input }, ctx);
      expect(createResult.errors[0].message).toMatch("one Routing per Page");
    });
  });

  describe("update", () => {
    it("can update a routing destination on a routing2", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: [
              {
                routing: {
                  else: {
                    logical: "NextPage"
                  }
                }
              }
            ]
          },
          { pages: [] }
        ]
      });

      const updateRouting2Mutation = `
        mutation updateRouting2($input: UpdateRouting2Input!) {
          updateRouting2(input: $input) {
            id
            else {
              logical
              page {
                id
              }
              section {
                id
              }
            }
          }
        }`;

      const routingId = questionnaire.sections[0].pages[0].routing.id;
      const sectionDestinationId = questionnaire.sections[1].id;

      const updateResult = await executeQuery(
        updateRouting2Mutation,
        { input: { id: routingId, else: { sectionId: sectionDestinationId } } },
        ctx
      );

      expect(updateResult.errors).toBeUndefined();
      expect(updateResult.data).toMatchObject({
        updateRouting2: {
          id: routingId.toString(),
          else: {
            logical: null,
            page: null,
            section: {
              id: sectionDestinationId.toString()
            }
          }
        }
      });
    });

    it("should error when the destination is invalid", async () => {
      const questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            pages: []
          },
          {
            pages: [
              {
                routing: {
                  else: {
                    logical: "NextPage"
                  }
                }
              }
            ]
          },
          { pages: [] }
        ]
      });

      const updateRouting2Mutation = `
        mutation updateRouting2($input: UpdateRouting2Input!) {
          updateRouting2(input: $input) {
            id
            else {
              logical
              page {
                id
              }
              section {
                id
              }
            }
          }
        }`;

      const routingId = questionnaire.sections[1].pages[0].routing.id;
      const sectionDestinationId = questionnaire.sections[0].id;

      const updateResult = await executeQuery(
        updateRouting2Mutation,
        { input: { id: routingId, else: { sectionId: sectionDestinationId } } },
        ctx
      );

      expect(updateResult.errors).not.toBeUndefined();
      expect(updateResult.errors[0].message).toMatch(
        "The provided desination is invalid"
      );
    });
  });
});
