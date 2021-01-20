const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const executeQuery = require("../../tests/utils/executeQuery");

const query = `
query testSkippable($input: QueryInput!) {
  skippable(input: $input) {
    __typename
    id
  }
}
`;

describe("skippable interface", () => {
  let ctx, page;

  beforeEach(async () => {
    ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  confirmation: {},
                },
              ],
            },
          ],
        },
      ],
    });

    page = ctx.questionnaire.sections[0].folders[0].pages[0];
  });

  afterEach(() => deleteQuestionnaire(ctx, ctx.questionnaire.id));

  it("should return correct schema type for QuestionPage", async () => {
    const response = await executeQuery(
      query,
      {
        input: {
          id: page.id,
        },
      },
      ctx
    );

    expect(response.data.skippable.__typename).toBe("QuestionPage");
  });

  it("should return correct schema type for QuestionConfirmation", async () => {
    const response = await executeQuery(
      query,
      {
        input: {
          id: page.confirmation.id,
        },
      },
      ctx
    );

    expect(response.data.skippable.__typename).toBe("QuestionConfirmation");
  });
});
