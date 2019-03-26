const executeQuery = require("../../executeQuery");

const movePageMutation = `
  mutation MovePage($input: MovePageInput!) {
    movePage(input: $input) {
      id        
      title
      alias
      displayName        
      pageType        
      section {
        id
        pages {
          id
        }
      }        
      position        
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
      routing {
        id
      }
      ... on QuestionPage {
        description
        guidance
        answers {
          id
        }
        definitionLabel
        definitionContent
        additionalInfoLabel
        additionalInfoContent
        confirmation {
          id
        }
      }
    }
  }
`;

const movePage = async (questionnaire, input) => {
  const result = await executeQuery(
    movePageMutation,
    { input },
    { questionnaire }
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.movePage;
};

module.exports = {
  movePageMutation,
  movePage,
};
