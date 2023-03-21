const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const executeQuery = require("../../executeQuery");

const updateQuestionnaireMutation = `
  mutation UpdateQuestionnaire($input: UpdateQuestionnaireInput!) {
    updateQuestionnaire(input: $input) {
      id
      title
      description
      formType
      eqId
      theme
      navigation
      surveyId
      summary
      shortTitle
      displayName
      publishStatus
    }
  }
`;

const updateQuestionnaire = async (ctx, input) => {
  const result = await executeQuery(
    updateQuestionnaireMutation,
    {
      input: filter(
        gql`
          {
            id
            title
            description
            formType
            eqId
            theme
            navigation
            surveyId
            summary
            shortTitle
            editors
            isPublic
          }
        `,
        input
      ),
    },
    ctx
  );
  return result.data.updateQuestionnaire;
};

module.exports = {
  updateQuestionnaireMutation,
  updateQuestionnaire,
};
