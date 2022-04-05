const executeQuery = require("../../executeQuery");

const updateQuestionnaireIntroductionMutation = `
  mutation UpdateQuestionnaireIntroduction($input: UpdateQuestionnaireIntroductionInput!) {
    updateQuestionnaireIntroduction(input: $input) {
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
      comments {
        id
        commentText
      }
    }
  }
`;

const updateQuestionnaireIntroduction = async (ctx, input) => {
  const result = await executeQuery(
    updateQuestionnaireIntroductionMutation,
    { input },
    ctx
  );
  return result.data.updateQuestionnaireIntroduction;
};

module.exports = {
  updateQuestionnaireIntroductionMutation,
  updateQuestionnaireIntroduction,
};
