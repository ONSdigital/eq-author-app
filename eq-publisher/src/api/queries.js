exports.getQuestionnaire = `
  fragment answerFragment on Answer {
    id
    type
    label
    description
    guidance
    properties
    qCode
    ...BasicAnswer
    ...CompositeAnswer
  }

  fragment CompositeAnswer on CompositeAnswer {
    validation {
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
    childAnswers {
      id
      label
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
    }
  }

  fragment MinValueValidationRule on MinValueValidationRule {
    id
    enabled
    custom
    inclusive
  }

  fragment MaxValueValidationRule on MaxValueValidationRule {
    id
    enabled
    custom
    inclusive
    entityType
    previousAnswer {
      id
    }
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
    previousAnswer {
      id
    }
    metadata {
      key
    }
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
    previousAnswer {
      id
    }
    metadata {
      key
    }
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

  fragment optionFragment on Option {
    id
    label
    description
    value
    qCode
    additionalAnswer {
      ...answerFragment
    }
  }

  fragment destinationFragment on RoutingDestination {
    ... on LogicalDestination {
      __typename
      logicalDestination
    }
    ... on AbsoluteDestination {
      __typename
      absoluteDestination {
        ... on QuestionPage {
          id
          __typename
        }
        ... on Section {
          id
          __typename
        }
      }
    }
  }

  fragment destination2Fragment on Destination2 {
    section {
      id
    }
    page {
      id
    }
    logical
  }

  fragment metadataFragment on Metadata {
    id
    key
    type
  }

  query GetQuestionnaire($questionnaireId: ID!) {
    questionnaire(id: $questionnaireId) {
      id
      title
      description
      theme
      legalBasis
      navigation
      surveyId
      summary
      metadata {
        ...metadataFragment
      }
      sections {
        id
        title
        introduction {
          introductionTitle
          introductionContent 
        }
        pages {
          ... on QuestionPage {
            id
            title
            description
            guidance
            definitionLabel
            definitionContent
            additionalInfoLabel
            additionalInfoContent
            pageType
            routingRuleSet {
              id
              else {
                ...destinationFragment
              }
              routingRules {
                id
                operation
                goto {
                  ...destinationFragment
                }
                conditions {
                  id
                  comparator
                  answer {
                    id
                    type
                    ... on MultipleChoiceAnswer {
                      options {
                        id
                        label
                        additionalAnswer {
                          id
                          label
                          type
                        }
                      }
                    }
                  }
                  routingValue {
                    ... on IDArrayValue {
                      value
                    }
                    ... on NumberValue {
                      numberValue
                    }
                  }
                }
              }
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
            }
            confirmation {
              id
              title
              positive {
                label
                description
              }
              negative {
                label
                description
              }
            }
            answers {
              ...answerFragment
              ... on MultipleChoiceAnswer {
                options {
                  ...optionFragment
                }
                mutuallyExclusiveOption {
                  ...optionFragment
                }
              }
            }
          }
        }
      }
    }
  }
`;
