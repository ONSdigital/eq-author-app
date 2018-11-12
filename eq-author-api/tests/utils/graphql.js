const createQuestionnaireMutation = `mutation CreateQuestionnaire($input: CreateQuestionnaireInput!) {
    createQuestionnaire(input: $input) {
      id
      title
      description
      navigation
      legalBasis
      theme
      sections {
        id
        pages {
          id
        }
      }
    }
  }
`;

const getSectionQuery = `
query getSection($id: ID!) {
  section(id: $id) {
    id
    title
    alias
    displayName
    pages{
      id
    }
    introductionTitle
    introductionContent
    introductionEnabled
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

const deletePageMutation = `
  mutation DeletePage($input: DeletePageInput!){
    deletePage(input: $input){
      id
    }
  }
`;

const deleteAnswerMutation = `
mutation DeleteAnswer($input: DeleteAnswerInput!){
  deleteAnswer(input: $input){
    id
  }
}
`;

const deleteOptionMutation = `
mutation DeleteOption($input: DeleteOptionInput!){
  deleteOption(input: $input){
    id
  }
}
`;

const createOptionMutation = `
mutation CreateOption($input: CreateOptionInput!){
  createOption(input: $input){
    id
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

const createQuestionPageMutation = `
  mutation CreateQuestionPage($input: CreateQuestionPageInput!){
    createQuestionPage(input: $input){
      id
    }
  }
`;

const getPageQuery = `
  query GetQuestionPage($id: ID!){
    questionPage(id:$id){
      id
      guidance
      description
      pageType
      position
      section{
        id
      }
    }
  }
`;

const createAnswerMutation = `
  mutation CreateAnswer($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id,
      description,
      guidance,
      qCode,
      label,
      type,
      ... on MultipleChoiceAnswer {
        options {
          id
        },
        other {
          answer {
            id
            type
          },
          option {
            id
          }
        }
      }
    }
  }
`;

const createOtherMutation = `
  mutation CreateOther($input: CreateOtherInput!) {
    createOther(input: $input) {
      option {
        id
      }
      answer {
        id
        type
        description
      }
    }
  }
`;

const deleteOtherMutation = `
  mutation DeleteOther($input: DeleteOtherInput!) {
    deleteOther(input: $input) {
      option {
        id
      }
      answer {
        id
        type
        description
      }
    }
  }
`;

const getAnswerQuery = `
  query GetAnswer($id: ID!) {
    answer(id: $id) {
      id
      description
      guidance
      qCode
      label
      type
      properties
      ...on CompositeAnswer{
            childAnswers{
              id
              label
            }
          }
      ... on MultipleChoiceAnswer {
        options {
          id
        },
        other {
          answer {
            id
            type
            description
          }
          option {
            id
          }
        }
      }
    }
  }
`;

const getAnswersQuery = `
  query GetAnswers($id: ID!) {
    page(id: $id) {
      ... on QuestionPage {
        answers {
          id
          type
          ...on CompositeAnswer{
            childAnswers{
              id
              label
            }
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
          ...on CompositeAnswer{
            childAnswers{
              id
              label
            }
          }
        }
      }

`;

const getBasicRoutingQuery = `
query GetPage($id: ID!){
  page(id: $id){
    ...on QuestionPage{
      id
      routingRuleSet{
        id
        questionPage{
          id
        }
        routingRules{
          id
          conditions{
            id
            routingValue{
              ...on IDArrayValue{
                value
              }
              ...on NumberValue {
                id
                numberValue
              }
            }
          }
        }
      }
    }
  }
}
`;

const createRoutingRuleSet = `
  mutation CreateRoutingRuleSet($input: CreateRoutingRuleSetInput!){
    createRoutingRuleSet(input: $input)
    {
      id
      questionPage{
        id
      }
      routingRules{
        id
      }
      else {
        ... on LogicalDestination {
          logicalDestination
        }
      }
    }
  }
`;

const createRoutingRule = `
  mutation CreateRoutingRule($input: CreateRoutingRuleInput!){
    createRoutingRule(input: $input)
    {
      id
      operation
      conditions {
        id
      }
      goto {
        ... on LogicalDestination {
          logicalDestination
        }
        ... on AbsoluteDestination {
          absoluteDestination {
            ...on QuestionPage{
              id
              section{
                id
              }
            }
            ...on Section{
              id
            }
          }
        }
      }
    }
  }
`;

const createRoutingCondition = `
  mutation CreateRoutingCondition($input: CreateRoutingConditionInput!){
    createRoutingCondition(input: $input)
    {
      id
      comparator
      questionPage {
        id
      }
      answer {
        id
      }
      routingValue {
        ... on IDArrayValue {
          value
        }
        ...on NumberValue{
          numberValue
        }
      }
    }
  }
`;

const updateRoutingRuleSet = `
mutation UpdateRoutingRuleSet($input: UpdateRoutingRuleSetInput!){
  updateRoutingRuleSet (input: $input)
  {
    id
    else {
      ... on LogicalDestination {
        logicalDestination
      }
      ... on AbsoluteDestination {
        absoluteDestination {
          ...on QuestionPage{
            id
            section{
              id
            }
          }
          ...on Section{
            id
          }
        }
      }
    }
  }
}
`;

const deleteRoutingRuleSet = `
mutation DeleteRoutingRuleSet($input: DeleteRoutingRuleSetInput!) {
  deleteRoutingRuleSet(input: $input) {
    id
  }
}
`;

const updateRoutingRule = `
mutation UpdateRoutingRule($input: UpdateRoutingRuleInput!){
  updateRoutingRule (input: $input)
  {
    id
    goto {
      ... on LogicalDestination {
        logicalDestination
      }
      ... on AbsoluteDestination {
        absoluteDestination {
          __typename
          ...on QuestionPage{
            id
            section{
              id
            }
          }
          ...on Section{
            id
          }
        }
      }
    }
  }
}
`;

const updateCondition = `
mutation($input: UpdateRoutingConditionInput!){
  updateRoutingCondition (input: $input)
  {
    id
    comparator
  }
}
`;

const deleteRoutingRule = `
  mutation($input: DeleteRoutingRuleInput!) {
    deleteRoutingRule(input: $input) {
      id
    }
  }
`;

const deleteRoutingCondition = `
  mutation($input: DeleteRoutingConditionInput!) {
    deleteRoutingCondition(input: $input) {
      id
    }
  }
`;

const updateConditionValue = `
  mutation($input: UpdateConditionValueInput!) {
    updateConditionValue(input: $input) {
      ...on NumberValue {
        id
        numberValue
      }
    }
  }
`;

const toggleConditionOption = `
  mutation($input: ToggleConditionOptionInput!) {
    toggleConditionOption (input: $input)
    {
      ...on IDArrayValue{
        value
      }
    }
  }
`;

const getEntireRoutingStructure = `
query QuestionPage($id: ID!) {
  questionPage(id: $id) {
    routingRuleSet {
      id
      questionPage {
        id
      }
      else {
        ... on LogicalDestination {
          logicalDestination
        }
        ... on AbsoluteDestination {
          absoluteDestination {
            ...on QuestionPage{
              id
              section{
                id
              }
            }
            ...on Section{
              id
            }
          }
        }
      }
      routingRules {
        id
        operation
        goto {
          ... on LogicalDestination {
            logicalDestination
          }
          ... on AbsoluteDestination {
            absoluteDestination {
              ...on QuestionPage{
                id
                section{
                  id
                }
              }
              ...on Section{
                id
              }
            }
          }
        }
        conditions {
          id
          comparator
          questionPage {
            id
          }
          answer {
            id
          }
          routingValue {
            ...on IDArrayValue {
              value
            }
            ...on NumberValue {
              id
              numberValue
            }
          }
        }
      }
    }
  }
}
`;

const getAvailableRoutingDestinations = `
query QuestionPage($id: ID!) {
  availableRoutingDestinations(pageId: $id) {
    ... on AvailableRoutingDestinations {
      logicalDestinations {
        logicalDestination
      }
      questionPages {
        id
      }
      sections {
        id
      }
    }
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
    description,
    guidance,
    qCode,
    label,
    type
    ...on CompositeAnswer{
      childAnswers{
        id
        label
      }
    }
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
  query QuestionPage($id: ID!) {
    answer(id: $id){
     id
     ...on BasicAnswer {
       validation{
         ...on NumberValidation{
           minValue{
             id
             enabled
             inclusive
             custom
           }
           maxValue{
            id
            enabled
            inclusive
            custom
            entityType
          }
         }
         ...on DateValidation {
           earliestDate {
             id
             enabled
             custom
             offset {
               value
               unit
             }
             relativePosition
           }
           latestDate {
             id
             enabled
             custom
             offset {
               value
               unit
             }
             relativePosition
           }
         }
       }
     }
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
  getSectionQuery,
  createAnswerMutation,
  createOtherMutation,
  deleteOtherMutation,
  getAnswerQuery,
  getAnswersQuery,
  createRoutingRuleSet,
  toggleConditionOption,
  getEntireRoutingStructure,
  updateAnswerMutation,
  getBasicRoutingQuery,
  updateRoutingRule,
  updateCondition,
  createSectionMutation,
  createQuestionPageMutation,
  getAvailableRoutingDestinations,
  getQuestionnaire,
  getPageQuery,
  updateRoutingRuleSet,
  createRoutingRule,
  deleteRoutingRule,
  createRoutingCondition,
  deleteRoutingCondition,
  deleteRoutingRuleSet,
  deletePageMutation,
  deleteAnswerMutation,
  deleteOptionMutation,
  createOptionMutation,
  moveSectionMutation,
  getAnswerValidations,
  toggleAnswerValidation,
  updateConditionValue,
  updateAnswerValidation,
  createExclusiveMutation,
  createMetadataMutation
};
