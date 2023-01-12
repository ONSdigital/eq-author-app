const executeQuery = require("../../executeQuery");

const moveSectionMutation = `
  fragment Questionnaire on Questionnaire {
    id
    title
    description
    surveyId
    theme
    qcodes
    navigation
    hub
    summary
    collapsibleSummary
    type
    shortTitle
    displayName
    createdBy {
      id
      picture
      name
      email
    }
    editors {
      id
      picture
      name
      email
    }
    isPublic
    permission
  }

  fragment ValidationErrorInfo on ValidationErrorInfo {
    id
    errors {
      id
      type
      field
      errorCode
    }
    totalCount
  }

  fragment Answer on Answer {
    id
    description
    guidance
    label
    secondaryLabel
    secondaryLabelDefault
    type
    properties
    displayName
    qCode
    advancedProperties
  }
  mutation MoveSection($input: MoveSectionInput!) {
    moveSection(input: $input) {
      ...Questionnaire
      introduction {
        id
      }
      metadata {
        id
        displayName
        type
        key
        dateValue
        regionValue
        languageValue
        textValue
      }
      themeSettings {
        id
        validationErrorInfo {
          ...ValidationErrorInfo
        }
      }
      locked
      publishStatus
      totalErrorCount
      sections {
        id
        title
        pageDescription
        displayName
        position
        questionnaire {
          id
        }
        folders {
          id
          alias
          displayName
          position
          pages {
            id
            title
            alias
            position
            displayName
            pageType
            ... on QuestionPage {
              answers {
                ...Answer
              }
              confirmation {
                id
              }
            }
            validationErrorInfo {
              ...ValidationErrorInfo
            }
          }
          validationErrorInfo {
            id
            totalCount
          }
        }
        validationErrorInfo {
          id
          totalCount
        }
      }
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
  }
`;

const moveSection = async (ctx, input) => {
  const result = await executeQuery(moveSectionMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.moveSection;
};

module.exports = {
  moveSectionMutation,
  moveSection,
};
