exports.getQuestionnaire = `
  fragment answerFragment on Answer {
    id
    type
    label
    secondaryLabel
    description
    guidance
    properties
    qCode
    ...BasicAnswer
  }
  
  fragment BasicAnswer on BasicAnswer {
    secondaryQCode
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

  fragment ExpressionGroup on ExpressionGroup2 {
    id
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
  
  fragment MinValueValidationRule on MinValueValidationRule {
    id
    enabled
    custom
    inclusive
    entityType
    previousAnswer {
      id
    }
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
    fallbackKey
    type
  }
  
  query GetQuestionnaire($input: QueryInput!) {
    questionnaire(input: $input) {
      id
      title
      description
      type
      theme
      introduction {
        id
        title
        description
        additionalGuidancePanel
        additionalGuidancePanelSwitch
        legalBasis
        secondaryTitle
        secondaryDescription
        collapsibles {
          id
          title
          description
        }
        tertiaryTitle
        tertiaryDescription
      }
      navigation
      surveyId
      previewTheme
      themes {
        id
        enabled
        shortName
        legalBasisCode
        eqId
        formType
      }
      summary
      collapsibleSummary
      metadata {
        ...metadataFragment
      }
      sections {
        id
        title
        introductionTitle
        introductionContent
        folders {
          id
          alias
          enabled
          skipConditions {
            ...ExpressionGroup
          }
          pages {
            id
            title
            pageType
            ... on CalculatedSummaryPage {
              totalTitle
              summaryAnswers {
                id
              }
            }
            ... on QuestionPage {
              description
              descriptionEnabled
              guidance
              guidanceEnabled
              definitionLabel
              definitionContent
              definitionEnabled
              additionalInfoLabel
              additionalInfoContent
              additionalInfoEnabled
              confirmation {
                id
                title
                qCode
                positive {
                  label
                  description
                }
                negative {
                  label
                  description
                }
                skipConditions {
                  ...ExpressionGroup
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
              routing {
                rules {
                  expressionGroup {
                    operator
                    ...ExpressionGroup
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
                ...ExpressionGroup
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
          }
        }
      }
    }
  }
`;
