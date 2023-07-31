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

  query GetPage($input: QueryInput!) {
    page(input: $input) {
      id
      title
      alias
      displayName
      pageType
      section {
        id
        allowRepeatingSection
      }
      folder {
        id
      }
      position
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
        summaryAnswers {
          id
        }
        pageDescription
        totalTitle
      }
      ... on QuestionPage {
        description
        descriptionEnabled
        pageDescription
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
        routing {
          id
          rules {
            id
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
                    ... on Metadata {
                      id
                      displayName
                      metadataType: type
                      key
                      textValue
                    }
                    ... on NoLeftSide {
                      reason
                    }
                  }
                  condition
                  secondaryCondition
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
                    ... on DateValue {
                      offset
                      offsetDirection
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
              secondaryCondition
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
        }
      }
      ... on ListCollectorQualifierPage {
        comments {
          id
          commentText
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
