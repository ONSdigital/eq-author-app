const { convertExpressionGroup } = require("./index");
const mockQuestionnaire = require("../../basicQuestionnaireJSON");
const { CHECKBOX, CURRENCY } = require("../../../constants/answerTypes");

describe("Expression group", () => {
  describe("Standard expressions", () => {
    let ctx;
    beforeEach(() => {
      const questionnaire = mockQuestionnaire;
      Object.assign(questionnaire.sections[0].folders[0].pages[1].answers[0], {
        options: [
          {
            id: "a",
            label: "optionA",
          },
          {
            id: "b",
            label: "optionB",
          },
        ],
        mutuallyExclusiveOption: {
          id: "c",
          label: "optionC",
        },
      });

      ctx = {
        questionnaireJson: questionnaire,
      };
    });

    it("Should properly translate a standard expression into array of when statements", () => {
      const mockExpressionGroup = {
        expressions: [
          {
            left: {
              id: "1",
              type: CURRENCY,
            },
            condition: "Equal",
            right: {
              number: 1,
            },
          },
        ],
      };

      expect(convertExpressionGroup(mockExpressionGroup, ctx)).toMatchObject([
        {
          id: "answer1",
          condition: "equals",
          value: 1,
        },
      ]);
    });
  });

  describe("Mutually exclusive expressions", () => {
    let ctx;
    beforeEach(() => {
      ctx = {
        questionnaireJson: JSON.parse(JSON.stringify(mockQuestionnaire)),
      };
    });

    it("should convert expression group containing an mutally exclusive option into array of whens", () => {
      const mockExpressionGroup = {
        expressions: [
          {
            left: {
              id: "2",
              type: CHECKBOX,
              options: [
                {
                  id: "a",
                },
                {
                  id: "b",
                },
              ],
            },
            condition: "AnyOf",
            right: {
              options: [
                {
                  id: "a",
                  label: "a",
                },
                {
                  id: "c",
                  label: "c",
                },
              ],
            },
          },
        ],
      };

      expect(convertExpressionGroup(mockExpressionGroup, ctx)).toMatchObject([
        {
          id: "answer2",
          condition: "contains any",
          values: ["a"],
        },
        { id: "answer2-exclusive", condition: "contains any", values: ["c"] },
      ]);
    });
  });
});
