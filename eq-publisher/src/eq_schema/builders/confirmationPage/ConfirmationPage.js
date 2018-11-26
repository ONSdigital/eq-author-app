const Block = require("../../Block");
const { CHECKBOX, RADIO } = require("../../../constants/answerTypes");

const buildAuthorConfirmationQuestion = (
  page,
  groupId,
  routingRuleSet,
  ctx
) => {
  const confirmationAnswerObject = {
    id: `confirmation-answer-for-${page.id}`,
    type: RADIO,
    properties: {
      required: true
    },
    options: [
      {
        id: "positive-confirmation",
        label: page.confirmation.positive.label,
        description: page.confirmation.positive.description,
        value: page.confirmation.positive.label
      },
      {
        id: "negative-confirmation",
        label: page.confirmation.negative.label,
        description: page.confirmation.negative.description,
        value: page.confirmation.negative.label
      }
    ]
  };

  const confirmationBackwardsRouting = {
    id: "negative-confirmation-answered",
    operation: "Or",
    goto: {
      __typename: "AbsoluteDestination",
      absoluteDestination: {
        id: page.id,
        __typename: "QuestionPage"
      }
    },
    conditions: [
      {
        id: `confirmation-condition-for-${page.id}`,
        answer: confirmationAnswerObject,
        comparator: "equal",
        routingValue: {
          value: ["negative-confirmation"]
        }
      }
    ]
  };

  if (!routingRuleSet) {
    routingRuleSet = {
      id: "default-rule-set",
      else: {
        __typename: "LogicalDestination",
        logicalDestination: "NextPage"
      },
      routingRules: []
    };
  }

  routingRuleSet.routingRules.unshift(confirmationBackwardsRouting);

  const confirmationQuestionObject = {
    id: `confirmation-page-for-${page.id}`,
    title: page.confirmation.title,
    description:
      page.answers[0].type === CHECKBOX
        ? `{{ answers['answer${page.answers[0].id}']|format_unordered_list }}`
        : null,
    pageType: "ConfirmationQuestion",
    routingRuleSet,
    answers: [confirmationAnswerObject]
  };

  return new Block(confirmationQuestionObject, groupId, ctx);
};

module.exports = {
  buildAuthorConfirmationQuestion
};
