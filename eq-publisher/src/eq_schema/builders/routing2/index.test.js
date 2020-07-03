const translateAuthorRouting = require("./");
const { RADIO, CURRENCY, CHECKBOX } = require("../../../constants/answerTypes");
const questionnaireJson = require("./basicQuestionnaireJSON");
const { AND, OR } = require("../../../constants/routingOperators");
const { v4: uuidv4 } = require("uuid");

describe("Routing2", () => {
  let routingGotos, ctx;
  beforeEach(() => {
    routingGotos = [];
    ctx = {
      questionnaireJson,
      routingGotos,
    };
  });
  it("should translate a complex example with 'And' correctly", () => {
    const authorRouting = {
      rules: [
        {
          expressionGroup: {
            operator: AND,
            expressions: [
              {
                left: {
                  id: "1",
                  type: CURRENCY,
                },
                condition: "Equal",
                right: {
                  number: 5,
                },
              },
            ],
          },
          destination: {
            logical: "NextPage",
          },
        },
        {
          expressionGroup: {
            operator: AND,
            expressions: [
              {
                left: {
                  id: "2",
                  type: RADIO,
                },
                condition: "OneOf",
                right: {
                  options: [
                    {
                      label: "red",
                    },
                    {
                      label: "white",
                    },
                  ],
                },
              },
            ],
          },
          destination: {
            logical: "EndOfQuestionnaire",
          },
        },
      ],
      else: {
        page: {
          id: "3",
        },
      },
    };

    const runnerRouting = translateAuthorRouting(authorRouting, "1", "1", ctx);
    expect(ctx.routingGotos).toMatchObject([
      {
        group: "confirmation-group",
        groupId: "group1",
        when: [
          {
            condition: "contains any",
            id: "answer2",
            values: ["red", "white"],
          },
        ],
      },
    ]);

    expect(runnerRouting).toMatchObject([
      {
        goto: {
          block: "block2",
          when: [
            {
              id: "answer1",
              condition: "equals",
              value: 5,
            },
          ],
        },
      },
      {
        goto: {
          group: "confirmation-group",
          when: [
            {
              id: "answer2",
              condition: "contains any",
              values: ["red", "white"],
            },
          ],
        },
      },
      {
        goto: {
          block: "block3",
        },
      },
    ]);
  });

  it("should translate example with 'Or' correctly", () => {
    const authorRouting = {
      rules: [
        {
          expressionGroup: {
            operator: OR,
            expressions: [
              {
                left: {
                  id: "1",
                  type: RADIO,
                  options: [
                    {
                      label: "A",
                    },
                    {
                      label: "B",
                    },
                  ],
                },
                condition: "OneOf",
                right: {
                  options: [
                    {
                      label: "A",
                    },
                  ],
                },
              },
            ],
          },
          destination: {
            logical: "NextPage",
          },
        },
        {
          expressionGroup: {
            operator: OR,
            expressions: [
              {
                left: {
                  id: "2",
                  type: RADIO,
                  options: [
                    {
                      label: "D",
                    },
                    {
                      label: "E",
                    },
                  ],
                },
                condition: "OneOf",
                right: {
                  options: [
                    {
                      label: "E",
                    },
                  ],
                },
              },
            ],
          },
          destination: {
            logical: "EndOfQuestionnaire",
          },
        },
      ],
      else: {
        page: {
          id: "3",
        },
      },
    };
    const runnerRouting = translateAuthorRouting(authorRouting, "1", "1", ctx);
    expect(runnerRouting).toMatchObject([
      {
        goto: {
          block: "block2",
          when: [
            {
              id: "answer1",
              condition: "contains any",
              values: ["A"],
            },
          ],
        },
      },
      {
        goto: {
          group: "confirmation-group",
          when: [
            {
              id: "answer2",
              condition: "contains any",
              values: ["E"],
            },
          ],
        },
      },
      {
        goto: {
          block: "block3",
        },
      },
    ]);
  });

  describe("Mutually exclusive routing", () => {
    it("Should create a second routing rule when a mutually exclusive checkbox option is included in a Binary Expression", () => {
      const newQuestionnaireJson = JSON.parse(
        JSON.stringify(questionnaireJson)
      );

      const standardOption = {
        id: uuidv4(),
        label: "Standard option 1",
      };

      const mutuallyExclusiveOption = {
        id: uuidv4(),
        label: "Mutually exclusive option",
      };

      const evaluatorPage = newQuestionnaireJson.sections[0].pages[0];

      const evaluatorAnswer = evaluatorPage.answers[0];

      evaluatorAnswer.type = CHECKBOX;
      evaluatorAnswer.options = [standardOption];
      evaluatorAnswer.mutuallyExclusiveOption = mutuallyExclusiveOption;

      const authorRouting = {
        rules: [
          {
            expressionGroup: {
              operator: OR,
              expressions: [
                {
                  left: evaluatorAnswer,
                  condition: "AnyOf",
                  right: {
                    options: [standardOption, mutuallyExclusiveOption],
                  },
                },
              ],
            },
            destination: {
              section: null,
              page: null,
              logical: "EndOfQuestionnaire",
            },
          },
        ],
        else: {
          section: null,
          page: null,
          logical: "NextPage",
        },
      };

      evaluatorPage.routing = authorRouting;

      const newCtx = { ...ctx, questionnaireJson: newQuestionnaireJson };

      const runnerRouting = translateAuthorRouting(
        authorRouting,
        "1",
        "1",
        newCtx
      );

      expect(authorRouting.rules.length).toBe(1);
      expect(runnerRouting.length).toBe(3);
      expect(runnerRouting.sort()).toEqual(
        [
          {
            goto: {
              group: "confirmation-group",
              when: [
                {
                  id: "answer1-exclusive",
                  condition: "contains any",
                  values: ["Mutually exclusive option"],
                },
              ],
            },
          },
          {
            goto: {
              group: "confirmation-group",
              when: [
                {
                  id: "answer1",
                  condition: "contains any",
                  values: ["Standard option 1"],
                },
              ],
            },
          },
          {
            goto: {
              block: "block2",
            },
          },
        ].sort()
      );
    });
  });
});
