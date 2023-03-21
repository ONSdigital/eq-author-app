const executeQuery = require("../../executeQuery");

const moveFolderMutation = `
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

mutation MoveFolderMutation($input: MoveFolderInput!) {
  moveFolder(input: $input) {
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
    locked
    publishStatus
    totalErrorCount
    sections {
      id
      title
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

const moveFolder = async (ctx, input) => {
  const result = await executeQuery(
    moveFolderMutation,
    {
      input,
    },
    ctx
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.moveFolder;
};

module.exports = {
  moveFolderMutation,
  moveFolder,
};
