const executeQuery = require("../../executeQuery");

const getPageQuery = `
  fragment destination2Fragment on Destination2 {
    section {
      id
    }
    page {
      id
    }
    logical
  }

  query GetPage($input: QueryInput!) {
    page(input: $input) {
      id
      title
      alias
      displayName
      pageType
      section {
        id
      }
      position
      availablePipingAnswers {
        id
      }
      availablePipingMetadata {
        id
      }
      validationErrorInfo {
        errors {
          id
          type
          field
          errorCode
        }
        totalCount
      }
      ... on CalculatedSummaryPage {
        availableSummaryAnswers {
          id
        }
        summaryAnswers {
          id
        }
        totalTitle
      }
      ... on QuestionPage {
        description
        descriptionEnabled
        guidance
        guidanceEnabled
        answers {
          ... on Answer {
            id
          }
        }
        definitionLabel
        definitionContent
        definitionEnabled
        additionalInfoLabel
        additionalInfoContent
        additionalInfoEnabled
        confirmation {
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
          rules {
            expressionGroup {
              operator
              validationErrorInfo {
                    id
                    errors {
                      id
                      type
                      field
                      errorCode
                    }
                    totalCount
                  }
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
                    ... on NoLeftSide {
                      reason
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
                  validationErrorInfo {
                    id
                    errors {
                      id
                      type
                      field
                      errorCode
                    }
                    totalCount
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
        }
        skipConditions {
          expressions {
            ... on BinaryExpression2 {
              id
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
                ... on NoLeftSide {
                  reason
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
              expressionGroup {
                id
                operator
              }
              validationErrorInfo {
                id
                errors {
                  id
                  type
                  field
                  errorCode
                }
                totalCount
              }
            }
          }
          id
        }
        totalValidation {
          id
          enabled
          entityType
          custom
          previousAnswer {
            id
          }
          condition
          availablePreviousAnswers {
            id
          }
        }
      }
    }
  }  
`;

const queryPage = async (ctx, pageId) => {
  const result = await executeQuery(
    getPageQuery,
    {
      input: { pageId },
    },
    ctx
  );

  return result.data.page;
};

module.exports = {
  getPageQuery,
  queryPage,
};
