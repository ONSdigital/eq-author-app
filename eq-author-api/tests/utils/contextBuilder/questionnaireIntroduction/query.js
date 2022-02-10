const executeQuery = require("../../executeQuery");

const queryIntroductionQuery = `
  query GetIntroduction($introductionId: ID!) {
    questionnaireIntroduction(id: $introductionId) {
      id
      title
      description
      secondaryTitle
      secondaryDescription
      additionalGuidancePanel
      additionalGuidancePanelSwitch
      contactDetailsPhoneNumber
      contactDetailsEmailAddress
      collapsibles {
        id
      }
      tertiaryTitle
      tertiaryDescription
      validationErrorInfo {
        totalCount
        errors {
          id
        }
      }
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
