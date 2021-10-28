const executeQuery = require("../../executeQuery");

const queryIntroductionQuery = `
  query GetIntroduction($introductionId: ID!) {
    questionnaireIntroduction(id: $introductionId) {
      id
      title
      description
      secondaryTitle
      secondaryDescription
      contactDetailsPanel
      contactDetailsPanelSwitch
      additionalGuidancePanel
      additionalGuidancePanelSwitch
      collapsibles {
        id
      }
      tertiaryTitle
      tertiaryDescription
    }
  }
`;

const queryQuestionnaireIntroduction = async (ctx, introductionId) => {
  const result = await executeQuery(
    queryIntroductionQuery,
    { introductionId },
    ctx
  );
  return result.data.questionnaireIntroduction;
};

module.exports = {
  queryIntroductionQuery,
  queryQuestionnaireIntroduction,
};
