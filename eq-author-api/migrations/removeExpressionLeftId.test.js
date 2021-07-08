const { getExpressions } = require("../schema/resolvers/utils");
const removeExpressionLeftId = require("./removeExpressionLeftId.js");

const questionnaire = {
  sections: [
    {
      folders: [
        {
          pages: [
            {
              routing: {
                rules: [
                  {
                    expressionGroup: {
                      expressions: [
                        {
                          left: {
                            __typename: "MultipleChoiceAnswer",
                            id: "434",
                            options: [
                              {
                                id: "176",
                              },
                              {
                                id: "177",
                              },
                            ],
                            type: "Answer",
                            answerId: "434",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

describe("Migration: remove obsolete left ID, typename, options from left side of expression group", () => {
  it("should remove ID, typename and options from expression group's lhs", () => {
    const newExpressions = getExpressions({
      questionnaire: removeExpressionLeftId(questionnaire),
    });
    expect(newExpressions[0].left.id).toBeUndefined();
    expect(newExpressions[0].left._typename).toBeUndefined();
    expect(newExpressions[0].left.options).toBeUndefined();
    expect(newExpressions[0].left.answerId).toBe("434");
  });
});
