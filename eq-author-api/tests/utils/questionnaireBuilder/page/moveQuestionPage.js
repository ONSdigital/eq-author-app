const executeQuery = require("../../executeQuery");

const moveQuestionPageMutation = `
  mutation MoveQuestionPage($input: MovePageInput!) {
    movePage(input: $input) {
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
          pages {
            id
          }
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

const moveQuestionPage = async (questionnaire, input) => {
  const result = await executeQuery(
    moveQuestionPageMutation,
    { input },
    { questionnaire }
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.movePage;
};

module.exports = {
  moveQuestionPageMutation,
  moveQuestionPage,
};
