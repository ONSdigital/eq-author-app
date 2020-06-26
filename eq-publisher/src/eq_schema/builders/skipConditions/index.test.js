const translateAuthorSkipConditions = require("./");
const { RADIO, CURRENCY } = require("../../../constants/answerTypes");

describe("skipConditions", () => {
  it("should translate a complex example correctly", () => {
    const authorSkipConditions = [
      {
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
      {
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
    ];

    const skipConditions = translateAuthorSkipConditions(authorSkipConditions);
    expect(skipConditions).toMatchObject([
      {
        when: [
          {
            id: "answer1",
            condition: "equals",
            value: 5,
          },
        ],
      },
      {
        when: [
          {
            id: "answer2",
            condition: "contains any",
            values: ["red", "white"],
          },
        ],
      },
    ]);
  });
});
