const executeQuery = require("../../../../tests/utils/executeQuery");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE,
} = require("../../../../constants/logicalDestinations");

const ROUTING_ID = 1;
const ROUTING_RULE_ID = 2;
const FIRST_DESTINATION_ID = 3;
const PAGE_ID = 4;
const LATER_PAGE_ID = 5;
const LATER_SECTION_ID = 6;

describe("Routing2 Unit", () => {
  describe("create", () => {
    it("should call the modifier to create the routing", async () => {
      const ctx = {
        repositories: {
          Destination: {
            getById: jest.fn(id => {
              return Promise.resolve({ id, logical: NEXT_PAGE });
            }),
          },
        },
        modifiers: {
          Routing: {
            create: jest.fn().mockResolvedValue({
              id: ROUTING_ID,
              destinationId: FIRST_DESTINATION_ID,
            }),
          },
        },
      };

      const query = `
          mutation createRouting2($input: CreateRouting2Input!) {
            createRouting2(input: $input) {
              id
              else {
                id
                logical
              }
            }
          }`;
      const input = {
        pageId: PAGE_ID,
      };
      const result = await executeQuery(query, { input }, ctx);
      expect(result.errors).toBeUndefined();

      expect(ctx.modifiers.Routing.create).toHaveBeenCalledWith(
        PAGE_ID.toString()
      );

      expect(result.data).toMatchObject({
        createRouting2: {
          id: ROUTING_ID.toString(),
          else: { id: FIRST_DESTINATION_ID.toString(), logical: NEXT_PAGE },
        },
      });
    });
  });

  describe("update", () => {
    it("should update the destination to a page", async () => {
      const ctx = {
        modifiers: {
          Routing: {
            update: jest.fn().mockResolvedValueOnce({
              id: ROUTING_ID,
              destinationId: FIRST_DESTINATION_ID,
            }),
          },
        },
        repositories: {
          Destination: {
            getById: jest.fn().mockResolvedValue({
              id: FIRST_DESTINATION_ID,
              pageId: LATER_PAGE_ID,
            }),
          },
          QuestionPage: {
            getById: jest.fn(id =>
              Promise.resolve({ id, pageType: "QuestionPage" })
            ),
          },
        },
      };

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

      const updateResult = await executeQuery(
        updateRouting2Mutation,
        { input: { id: ROUTING_ID, else: { pageId: LATER_PAGE_ID } } },
        ctx
      );

      expect(updateResult.errors).toBeUndefined();
      expect(ctx.modifiers.Routing.update).toHaveBeenCalledWith({
        id: ROUTING_ID.toString(),
        else: {
          pageId: LATER_PAGE_ID.toString(),
        },
      });

      expect(updateResult.data).toMatchObject({
        updateRouting2: {
          id: ROUTING_ID.toString(),
          else: {
            logical: null,
            page: { id: LATER_PAGE_ID.toString() },
            section: null,
          },
        },
      });
    });

    it("should error when providing more than one destination", async () => {
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
      const updateResult = await executeQuery(
        updateRouting2Mutation,
        {
          input: {
            id: ROUTING_RULE_ID,
            else: {
              logical: END_OF_QUESTIONNAIRE,
              sectionId: LATER_SECTION_ID,
            },
          },
        },
        {}
      );

      expect(updateResult.errors[0].message).toMatch(
        "Can only provide one destination."
      );
    });
  });
});
