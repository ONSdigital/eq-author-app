const translateAuthorRouting = require("./");
const { RADIO, CURRENCY } = require("../../../constants/answerTypes");
const questionnaireJson = require("./basicQuestionnaireJSON");

describe("Routing2", () => {
  it("Should translate a complex example", () => {
    const routingGotos = [];
    const ctx = {
      questionnaireJson,
      routingGotos,
    };
    const authorRouting = {
      rules: [
        {
          expressionGroup: {
            operator: "AND",
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
            operator: "AND",
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
          { condition: "equals", id: "answer2", value: "red" },
          { condition: "equals", id: "answer2", value: "white" },
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
              condition: "equals",
              value: "red",
            },
            {
              id: "answer2",
              condition: "equals",
              value: "white",
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
});
