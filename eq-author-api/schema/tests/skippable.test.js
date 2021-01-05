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
  let ctx;

  beforeEach(async () => {
    ctx = await buildContext({
      sections: [
        {
          pages: [
            {
              confirmation: {},
            },
          ],
        },
      ],
    });
  });

  afterEach(() => deleteQuestionnaire(ctx, ctx.questionnaire.id));

  it("should return correct schema type for QuestionPage", async () => {
    const response = await executeQuery(
      query,
      {
        input: {
          pageId: ctx.questionnaire.sections[0].pages[0].id,
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
          confirmationId:
            ctx.questionnaire.sections[0].pages[0].confirmation.id,
        },
      },
      ctx
    );

    expect(response.data.skippable.__typename).toBe("QuestionConfirmation");
  });
});
