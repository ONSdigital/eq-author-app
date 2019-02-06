const createQuestionnaireMutation = `mutation CreateQuestionnaire($input: CreateQuestionnaireInput!) {
    createQuestionnaire(input: $input) {
      id
      title
      description
      navigation
      legalBasis
      theme
      metadata {
        id
      }
      sections {
        id
        pages {
          id
          ... on QuestionPage {
            answers {
              id
            }
          }
        }
      }
    }
  }
`;

const deleteQuestionnaireMutation = `mutation DeleteQuestionnaire($input: DeleteQuestionnaireInput!) {
    deleteQuestionnaire(input: $input) {
      id
    }
  }
`;

const createSectionMutation = `
  mutation CreateSection($input: CreateSectionInput!){
    createSection(input: $input){
      id
    }
  }
`;

const createOptionMutation = `
mutation CreateOption($input: CreateOptionInput!){
  createOption(input: $input){
    id
    additionalAnswer{
      id
      type
      description
    }
  }
}
`;

const createExclusiveMutation = `
mutation createMutuallyExclusiveOption($input: CreateMutuallyExclusiveOptionInput!) {
  createMutuallyExclusiveOption(input: $input) {
    id
    description
    label
  }
}
`;

const createAnswerMutation = `
  mutation CreateAnswer($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id
      description
      guidance
      qCode
      label
      type
      ... on MultipleChoiceAnswer {
        options {
          id
          additionalAnswer {
            id
            type
          }
        }
      }
    }
  }
`;

const getAnswerQuery = `
  query GetAnswer($input: QueryInput!) {
    answer(input: $input) {
      id
      description
      guidance
      qCode
      label
      type
      properties
      ... on MultipleChoiceAnswer {
        options {
          id
          additionalAnswer{
            id
            type
            description
          }
        }
      }
    }
  }
`;

const getPipableAnswersQuery = `
  query GetAnswers($ids: [ID]!) {
    answers(ids: $ids) {
      id
      description
      guidance
      label
      type
      properties
    }
  }
`;

const getQuestionnaire = `
query QuestionPage($id: ID!) {
  questionnaire(id: $id) {
  	id
    sections{
      id
      pages{
        id
      }
    }
  }
}
`;

const updateAnswerMutation = `
mutation UpdateAnswer($input: UpdateAnswerInput!) {
  updateAnswer(input: $input) {
    id,
    description
    guidance
    qCode
    label
    type
 
  }
}
`;

const moveSectionMutation = `
mutation MoveSection($input: MoveSectionInput!) {
  moveSection(input: $input) {
    id
    position
    __typename
  }
}`;

const getAnswerValidations = `
query QuestionPage($input: QueryInput!) {
  answer(input: $input) {
    id
    ...BasicAnswer
  }
}

fragment BasicAnswer on BasicAnswer {
  validation {
    ... on NumberValidation {
      minValue {
        ...MinValueValidationRule
      }
      maxValue {
        ...MaxValueValidationRule
      }
    }
    ... on DateValidation {
      earliestDate {
        ...EarliestDateValidationRule
      }
      latestDate {
        ...LatestDateValidationRule
      }
    }
    ... on DateRangeValidation {
      earliestDate {
        ...EarliestDateValidationRule
      }
      latestDate {
        ...LatestDateValidationRule
      }
      minDuration {
        ...MinDurationValidationRule
      }
      maxDuration {
        ...MaxDurationValidationRule
      }
    }
  }
}

fragment MinValueValidationRule on MinValueValidationRule {
  id
  enabled
  custom
  inclusive
  entityType
}

fragment MaxValueValidationRule on MaxValueValidationRule {
  id
  enabled
  custom
  inclusive
  entityType
}

fragment EarliestDateValidationRule on EarliestDateValidationRule {
  id
  enabled
  entityType
  custom
  offset {
    value
    unit
  }
  relativePosition
}

fragment LatestDateValidationRule on LatestDateValidationRule {
  id
  enabled
  entityType
  custom
  offset {
    value
    unit
  }
  relativePosition
}

fragment MinDurationValidationRule on MinDurationValidationRule {
  id
  enabled
  duration {
    value
    unit
  }
}

fragment MaxDurationValidationRule on MaxDurationValidationRule {
  id
  enabled
  duration {
    value
    unit
  }
}
`;

const toggleAnswerValidation = `
  mutation toggleValidation($input: ToggleValidationRuleInput!){
    toggleValidationRule(input: $input){
      id
      enabled
    }
  }
`;

const updateAnswerValidation = `
mutation updateValidation($input: UpdateValidationRuleInput!){
  updateValidationRule(input: $input){
    id
    ...on MinValueValidationRule {
      custom
      inclusive
      entityType
      previousAnswer {
        id
      }
    }
    ...on MaxValueValidationRule {
      custom
      inclusive
      entityType
      previousAnswer {
        id
      }
    }
    ...on EarliestDateValidationRule {
      customDate: custom
      offset {
        value
        unit
      }
      relativePosition
      entityType
      previousAnswer {
        id
      }
      metadata {
        id
      }
    }
    ...on LatestDateValidationRule {
      customDate: custom
      offset {
        value
        unit
      }
      relativePosition
      entityType
      previousAnswer {
        id
      }
      metadata {
        id
      }
    }
    ...on MinDurationValidationRule {
      duration {
        value
        unit
      }
    }
    ...on MaxDurationValidationRule {
      duration {
        value
        unit
      }
    }
  }
}
`;

const createMetadataMutation = `
  mutation CreateMetadata($input: CreateMetadataInput!) {
    createMetadata(input: $input) {
      id
    }
  }
`;

module.exports = {
  getPipableAnswersQuery,
  createQuestionnaireMutation,
  createAnswerMutation,
  deleteQuestionnaireMutation,
  getAnswerQuery,
  updateAnswerMutation,
  createSectionMutation,
  getQuestionnaire,
  createOptionMutation,
  moveSectionMutation,
  getAnswerValidations,
  toggleAnswerValidation,
  updateAnswerValidation,
  createExclusiveMutation,
  createMetadataMutation,
};
