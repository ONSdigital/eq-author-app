const {
  getMutallyExclusiveAnswer,
  convertExclusiveExpression,
  convertNonExclusiveExpression,
} = require("./index");
const mQuestionnaire = require("../../basicQuestionnaireJSON");
const { CHECKBOX } = require("../../../constants/answerTypes");

const buildMutuallyExclusiveAnswer = questionnaire => {
  const newQuestionnaire = JSON.parse(JSON.stringify(questionnaire));

  const pages = newQuestionnaire.sections[0].pages;
  const pageOne = pages[0];
  const pageOneAnswers = pageOne.answers;

  pageOneAnswers[0] = {
    ...pageOneAnswers[0],
    type: CHECKBOX,
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
  };

  return newQuestionnaire;
};

describe("Expression group", () => {
  describe("Standard expressions", () => {
    let ctx;
    beforeEach(() => {
      ctx = {
        questionnaireJson: JSON.parse(JSON.stringify(mQuestionnaire)),
      };
    });
    it("Should properly translate a standard expression", () => {
      const answer = {
        id: "1",
        type: CHECKBOX,
        options: [
          {
            id: "a",
            label: "a",
          },
          {
            id: "b",
            label: "b",
          },
        ],
      };

      const pageOne = ctx.questionnaireJson.sections[0].pages[0];

      pageOne.answers[0] = answer;

      const expression = {
        left: { ...answer },
        condition: "AllOf",
        right: {
          options: [
            {
              id: "b",
              label: "b",
            },
          ],
        },
      };

      expect(convertNonExclusiveExpression(expression)).toMatchObject({
        left: {
          id: "1",
          type: CHECKBOX,
          options: [
            {
              id: "a",
              label: "a",
            },
            {
              id: "b",
              label: "b",
            },
          ],
        },
        condition: "AllOf",
        right: {
          options: [
            {
              id: "b",
              label: "b",
            },
          ],
        },
      });
    });
  });

  describe("Mutually exclusive expressions", () => {
    let mQuestionnaireMutuallyExclusive, ctx;
    beforeEach(() => {
      mQuestionnaireMutuallyExclusive = buildMutuallyExclusiveAnswer(
        mQuestionnaire
      );
      ctx = {
        questionnaireJson: mQuestionnaireMutuallyExclusive,
      };
    });
    it("Should be able to get the mutually exclusive counterpart of a given answer id, if one exists", () => {
      expect(getMutallyExclusiveAnswer("1", ctx)).toMatchObject({
        id: "c",
        label: "optionC",
      });
    });

    it("Should return null if trying to get the mutually exclusive counter part of a given id, if one does not exist", () => {
      expect(getMutallyExclusiveAnswer("2", ctx)).toBeFalsy();
    });

    it("Should propperly translate a mutually exclusive expression", () => {
      const answer =
        mQuestionnaireMutuallyExclusive.sections[0].pages[0].answers[0];
      const mutuallyExclusiveOption = answer.mutuallyExclusiveOption;

      const expression = {
        left: {
          ...Object.keys(answer)
            .filter(key => ["id", "type", "options"].includes(key))
            .reduce((obj, key) => {
              obj[key] = answer[key];
              return obj;
            }, {}),
        },
        condition: "AnyOf",
        right: {
          options: [({ id, label } = mutuallyExclusiveOption)], // eslint-disable-line no-undef
        },
      };

      expect(convertExclusiveExpression(expression)).toMatchObject({
        left: {
          id: "1-exclusive",
          type: CHECKBOX,
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
        },
        condition: "AnyOf",
        right: {
          options: [
            {
              id: "c",
              label: "optionC",
            },
          ],
        },
      });
    });
  });
});
