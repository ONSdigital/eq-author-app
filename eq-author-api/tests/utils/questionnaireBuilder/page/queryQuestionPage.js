const executeQuery = require("../../executeQuery");

const getQuestionPageQuery = `
  fragment destination2Fragment on Destination2 {
    section {
      id
    }
    page {
      id
    }
    logical
  }

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
          ...on Answer {
             id         
          }
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
          rules {
            expressionGroup {
              operator
              expressions {
                ... on BinaryExpression2 {
                  left {
                    ... on BasicAnswer {
                      id
                      type
                      label
                    }
                    ... on MultipleChoiceAnswer {
                      id
                      type
                      options {
                        id
                      }
                    }
                  }
                  condition
                  right {
                    ... on CustomValue2 {
                      number
                    }
                    ... on SelectedOptions2 {
                      options {
                        id
                        label
                      }
                    }
                  }
                }
              }
            }
            destination {
              ...destination2Fragment
            }
          }
          else {
            ...destination2Fragment
          }
          page {
            id
            title
          }
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
