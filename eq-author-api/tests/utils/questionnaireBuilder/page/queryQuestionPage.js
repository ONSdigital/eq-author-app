const executeQuery = require("../../executeQuery");

const getQuestionPageQuery = `
  query GetQuestionPage($input: QueryInput!) {
    page(input: $input) {
      id
      ... on QuestionPage {
        title
        alias
        displayName
        description
        guidance
        pageType
        answers {
          id
        }
        section {
          id
        }
        position
        definitionLabel
        definitionContent
        additionalInfoLabel
        additionalInfoContent
        availablePipingAnswers {
          id
        }
        availablePipingMetadata {
          id
        }
        availableRoutingAnswers {
          id
        }
        availableRoutingDestinations {
          logicalDestinations {
            id
          }
        }
        confirmation {
          id
        }
        routing {
          id
        }
      }
    }
  }
`;

const queryQuestionPage = async (questionnaire, pageId) => {
  const result = await executeQuery(
    getQuestionPageQuery,
    {
      input: { pageId },
    },
    { questionnaire }
  );

  return result.data.page;
};

module.exports = {
  getQuestionPageQuery,
  queryQuestionPage,
};
