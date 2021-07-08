const { getExpressions } = require("../schema/resolvers/utils");
const updateExpressionSchema = require("./updateExpressionSchema");

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
                          right: {
                            options: [
                              {
                                id: "176",
                              },
                              {
                                id: "177",
                              },
                            ],
                            optionIds: ["176", "177"],
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

describe("Migration: update expression schema to avoid using `options` and duplicated IDs", () => {
  it("should remove ID, typename and options from expression group's lhs, options from rhs", () => {
    const newExpressions = getExpressions({
      questionnaire: updateExpressionSchema(questionnaire),
    });
    expect(newExpressions[0].left.id).toBeUndefined();
    expect(newExpressions[0].left._typename).toBeUndefined();
    expect(newExpressions[0].left.options).toBeUndefined();
    expect(newExpressions[0].left.answerId).toBe("434");
    expect(newExpressions[0].right.options).toBeUndefined();
    expect(newExpressions[0].right.optionIds).toStrictEqual(["176", "177"]);
  });
});
