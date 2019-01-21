module.exports = `

scalar Date

scalar JSON

directive @deprecated(reason: String) on INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION |ENUM_VALUE | FIELD_DEFINITION | INPUT_OBJECT

type User {
  id: ID!
  name: String!
  picture: String
  email: String
}

type QuestionnaireInfo {
  totalSectionCount: Int!
}

type Questionnaire {
  id: ID!
  title: String
  description: String
  theme: Theme
  legalBasis: LegalBasis
  navigation: Boolean
  surveyId: String
  createdAt: Date
  createdBy: User!
  sections: [Section]
  summary: Boolean
  questionnaireInfo: QuestionnaireInfo
  metadata: [Metadata!]!
}

type Section {
  id: ID!
  title: String!
  alias: String
  displayName: String!
  pages: [Page]
  questionnaire: Questionnaire
  position: Int!
  introduction: SectionIntroduction
  availablePipingAnswers: [Answer!]!
  availablePipingMetadata: [Metadata!]!
}

type SectionIntroduction {
  id: ID!
  introductionTitle: String
  introductionContent: String
  section: Section!
}

interface Page {
  id: ID!
  title: String!
  alias: String
  displayName: String!
  description: String
  pageType: PageType!
  section: Section
  position: Int!
}

type QuestionPage implements Page {
  id: ID!
  title: String!
  alias: String
  displayName: String!
  description: String!
  guidance: String
  pageType: PageType!
  answers: [Answer]
  section: Section
  position: Int!
  definitionLabel: String
  definitionContent: String
  additionalInfoLabel: String
  additionalInfoContent: String
  routingRuleSet: RoutingRuleSet
  availablePipingAnswers: [Answer!]!
  availablePipingMetadata: [Metadata!]!
  availableRoutingAnswers: [Answer!]!
  availableRoutingQuestions: [Page!]!
  availableRoutingDestinations: AvailableRoutingDestinations!
  confirmation: QuestionConfirmation
  routing: Routing2
}

type ConfirmationOption {
  label: String
  description: String
}

type QuestionConfirmation {
  id: ID!
  displayName: String!
  title: String
  page: QuestionPage!
  positive: ConfirmationOption!
  negative: ConfirmationOption!
  availablePipingAnswers: [Answer!]!
  availablePipingMetadata: [Metadata!]!
}

interface Answer {
  id: ID!
  displayName: String!
  description: String
  guidance: String
  qCode: String
  label: String
  type: AnswerType!
  page: QuestionPage
  properties: JSON
}

type BasicAnswer implements Answer {
  id: ID!
  displayName: String!
  description: String
  guidance: String
  qCode: String
  label: String
  secondaryLabel: String
  type: AnswerType!
  page: QuestionPage
  properties: JSON
  validation: ValidationType
}

type MultipleChoiceAnswer implements Answer {
  id: ID!
  displayName: String!
  description: String
  guidance: String
  qCode: String
  label: String
  type: AnswerType!
  options: [Option]
  mutuallyExclusiveOption: Option
  page: QuestionPage
  properties: JSON
}

type CompositeAnswer implements Answer {
  id: ID!
  displayName: String!
  description: String
  guidance: String
  qCode: String
  label: String
  type: AnswerType!
  page: QuestionPage
  childAnswers: [BasicAnswer]!
  properties: JSON
  validation: ValidationType
}

type Option {
  id: ID!
  displayName: String!
  label: String
  description: String
  value: String
  qCode: String
  answer: Answer
  additionalAnswer: BasicAnswer
}

type RoutingRuleSet {
  id: ID!
  routingRules: [RoutingRule]
  questionPage: QuestionPage
  else: RoutingDestination
}

type RoutingRule {
  id: ID!
  operation: RoutingOperation
  conditions: [RoutingCondition]
  goto: RoutingDestination
}

enum LogicalDestinations {
  NextPage
  EndOfQuestionnaire
}

enum AbsoluteDestinationTypes {
  Section
  QuestionPage
}

union AbsoluteDestinations = QuestionPage | Section

type AbsoluteDestination {
  absoluteDestination: AbsoluteDestinations!
}

type LogicalDestination {
  id: ID!
  logicalDestination: LogicalDestinations!
}

union RoutingDestination = AbsoluteDestination | LogicalDestination

type AvailableRoutingDestinations {
  logicalDestinations: [LogicalDestination]!
  questionPages: [QuestionPage]!
  sections: [Section]!
}

type RoutingCondition {
  id: ID!
  comparator: RoutingComparator
  questionPage: QuestionPage
  answer: Answer
  routingValue: RoutingConditionValue
}

type IDArrayValue {
  value: [ID]
}

type NumberValue {
  id: ID!
  numberValue: Int 
}

union RoutingConditionValue = IDArrayValue | NumberValue

union ValidationType = NumberValidation | DateValidation | DateRangeValidation

enum ValidationRuleEntityType {
  Custom
  PreviousAnswer
  Metadata
  Now
}

type NumberValidation {
  minValue: MinValueValidationRule!
  maxValue: MaxValueValidationRule!
}

type DateValidation {
  earliestDate: EarliestDateValidationRule!
  latestDate: LatestDateValidationRule!
}

type DateRangeValidation {
  earliestDate: EarliestDateValidationRule!
  latestDate: LatestDateValidationRule!
  minDuration: MinDurationValidationRule!
  maxDuration: MaxDurationValidationRule!
}

interface ValidationRule {
  id: ID!
  enabled: Boolean!
}

type MinValueValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  inclusive: Boolean!
  custom: Int
}

type MaxValueValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  inclusive: Boolean!
  custom: Int
  previousAnswer: BasicAnswer
  entityType: ValidationRuleEntityType
  availablePreviousAnswers: [Answer!]!
}

type EarliestDateValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  offset: Duration!
  relativePosition: RelativePosition!
  custom: Date
  previousAnswer: BasicAnswer
  metadata: Metadata
  entityType: ValidationRuleEntityType
  availablePreviousAnswers: [Answer!]!
  availableMetadata: [Metadata!]!
}

type LatestDateValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  offset: Duration!
  relativePosition: RelativePosition!
  custom: Date
  previousAnswer: BasicAnswer
  metadata: Metadata
  entityType: ValidationRuleEntityType
  availablePreviousAnswers: [Answer!]!
  availableMetadata: [Metadata!]!
}

type MinDurationValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  duration: Duration!
}

type MaxDurationValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  duration: Duration!
}

type Duration {
  value: Int
  unit: DurationUnit!
}

enum DurationUnit {
  Days
  Months
  Years
}

enum RelativePosition {
  Before
  After
}

enum RoutingOperation {
  And
  Or
}

enum RoutingComparator {
  Equal
  NotEqual
  GreaterThan
  LessThan
  GreaterOrEqual
  LessOrEqual
}

enum PageType {
  QuestionPage
  InterstitialPage
}

enum AnswerType {
  Checkbox
  Currency
  Date
  DateRange
  MonthYearDate
  Number
  Percentage
  Radio
  TextArea
  TextField
  Relationship
}

enum LegalBasis {
  Voluntary
  StatisticsOfTradeAct
}

enum Theme {
  default
  census
}

type Metadata {
    id: ID!
    key: String
    alias: String
    type: MetadataType!
    dateValue: Date
    regionValue: Region
    languageValue: Language
    textValue: String
    displayName: String!
}

enum MetadataType {
    Date
    Text
    Region
    Language
}

enum Region {
    GB_ENG
    GB_GBN
    GB_NIR
    GB_SCT
    GB_WLS
}

enum Language {
    en
    cy
}

enum LogicalDestination2 {
  NextPage
  EndOfQuestionnaire
}

type Destination2  {
  id: ID!
  section: Section
  page: Page
  logical: LogicalDestination2
}

type Routing2 {
  id: ID!
  page: Page!
  else: Destination2!
  rules: [RoutingRule2!]! 
}

type RoutingRule2 {
  id: ID!
  destination: Destination2!
  expressionGroup: ExpressionGroup2!
  routing: Routing2!
}

enum RoutingOperator2 {
  And
  Or
}

union Expression2 = BinaryExpression2 | ExpressionGroup2

type ExpressionGroup2 {
  id: ID!
  operator: RoutingOperator2!
  expressions: [Expression2!]!
}

enum NoLeftSideReason {
  SelectedAnswerDeleted
  NoRoutableAnswerOnPage
}

type NoLeftSide {
  reason: NoLeftSideReason!
}

union LeftSide2 = BasicAnswer | MultipleChoiceAnswer | NoLeftSide

union RightSide2 = SelectedOptions2 | CustomValue2

type CustomValue2 {
  number: Int
}

type SelectedOptions2 {
  options: [Option!]!
}

enum RoutingCondition2 {
  Equal
  NotEqual
  GreaterThan
  LessThan
  GreaterOrEqual
  LessOrEqual
  OneOf
}

type BinaryExpression2 {
  id: ID!
  left: LeftSide2!
  condition: RoutingCondition2!
  right: RightSide2
  expressionGroup: ExpressionGroup2!
}


type Query {
  questionnaires: [Questionnaire]
  questionnaire(id: ID!): Questionnaire
  section(id: ID!): Section
  page(id: ID!): Page
  questionPage(id: ID!): QuestionPage
  answer(id: ID!): Answer
  answers(ids: [ID]!): [Answer]
  option(id: ID!): Option
  pagesAffectedByDeletion(pageId: ID!): [Page]! @deprecated(reason: "Not implemented")
  availableRoutingDestinations(pageId: ID!): AvailableRoutingDestinations! @deprecated(reason: "Use availableRoutingDestinations on QuestionPage type instead")
  questionConfirmation(id: ID!): QuestionConfirmation
  me: User!
}

type Mutation {
  createQuestionnaire(input: CreateQuestionnaireInput!): Questionnaire
  updateQuestionnaire(input: UpdateQuestionnaireInput!): Questionnaire
  deleteQuestionnaire(input: DeleteQuestionnaireInput!): Questionnaire
  undeleteQuestionnaire(input: UndeleteQuestionnaireInput!): Questionnaire
  duplicateQuestionnaire(input: DuplicateQuestionnaireInput!): Questionnaire
  createSection(input: CreateSectionInput!): Section
  updateSection(input: UpdateSectionInput!): Section
  deleteSection(input: DeleteSectionInput!): Section
  undeleteSection(input: UndeleteSectionInput!): Section
  moveSection(input: MoveSectionInput!): Section
  duplicateSection(input: DuplicateSectionInput!): Section
  createSectionIntroduction(input: CreateSectionIntroductionInput!): SectionIntroduction!
  updateSectionIntroduction(input: UpdateSectionIntroductionInput!): SectionIntroduction!
  deleteSectionIntroduction(input: DeleteSectionIntroductionInput!): SectionIntroduction!
  createPage(input: CreatePageInput!): Page
  updatePage(input: UpdatePageInput!): Page
  deletePage(input: DeletePageInput!): Page
  undeletePage(input: UndeletePageInput!): Page
  movePage(input: MovePageInput!): Page
  duplicatePage(input: DuplicatePageInput!): Page
  createQuestionPage(input: CreateQuestionPageInput!): QuestionPage
  updateQuestionPage(input: UpdateQuestionPageInput!): QuestionPage
  deleteQuestionPage(input: DeleteQuestionPageInput!): QuestionPage
  undeleteQuestionPage(input: UndeleteQuestionPageInput!): QuestionPage
  createAnswer(input: CreateAnswerInput!): Answer
  updateAnswer(input: UpdateAnswerInput!): Answer
  deleteAnswer(input: DeleteAnswerInput!): Answer
  undeleteAnswer(input: UndeleteAnswerInput!): Answer
  createOption(input: CreateOptionInput!): Option
  createMutuallyExclusiveOption(input: CreateMutuallyExclusiveOptionInput!): Option
  updateOption(input: UpdateOptionInput!): Option
  deleteOption(input: DeleteOptionInput!): Option
  undeleteOption(input: UndeleteOptionInput!): Option
  createRoutingRuleSet(input: CreateRoutingRuleSetInput!): RoutingRuleSet
  updateRoutingRuleSet(input: UpdateRoutingRuleSetInput!): RoutingRuleSet
  deleteRoutingRuleSet(input: DeleteRoutingRuleSetInput!): RoutingRuleSet
  resetRoutingRuleSetElse(input: ResetRoutingRuleSetElseInput!): RoutingRuleSet
  createRoutingRule(input: CreateRoutingRuleInput!): RoutingRule
  updateRoutingRule(input: UpdateRoutingRuleInput!): RoutingRule
  deleteRoutingRule(input: DeleteRoutingRuleInput!): RoutingRule
  undeleteRoutingRule(input: UndeleteRoutingRuleInput!): RoutingRule
  createRoutingCondition(input: CreateRoutingConditionInput!): RoutingCondition
  updateRoutingCondition(input: UpdateRoutingConditionInput!): RoutingCondition
  deleteRoutingCondition(input: DeleteRoutingConditionInput!): RoutingCondition
  toggleConditionOption(input: ToggleConditionOptionInput!): RoutingConditionValue
  createConditionValue(input: CreateConditionValueInput!): RoutingConditionValue
  updateConditionValue(input: UpdateConditionValueInput!): RoutingConditionValue
  toggleValidationRule(input: ToggleValidationRuleInput!): ValidationRule!
  updateValidationRule(input: UpdateValidationRuleInput!): ValidationRule!
  createMetadata(input: CreateMetadataInput!): Metadata!
  updateMetadata(input: UpdateMetadataInput!): Metadata!
  deleteMetadata(input: DeleteMetadataInput!): Metadata!
  createQuestionConfirmation(input: CreateQuestionConfirmationInput): QuestionConfirmation!
  updateQuestionConfirmation(input: UpdateQuestionConfirmationInput): QuestionConfirmation!
  deleteQuestionConfirmation(input: DeleteQuestionConfirmationInput): QuestionConfirmation!
  undeleteQuestionConfirmation(input: UndeleteQuestionConfirmationInput): QuestionConfirmation!
  createRouting2(input: CreateRouting2Input!): Routing2!
  updateRouting2(input: UpdateRouting2Input!): Routing2! 
  createRoutingRule2(input: CreateRoutingRule2Input!): RoutingRule2!
  updateRoutingRule2(input: UpdateRoutingRule2Input!): RoutingRule2! 
  deleteRoutingRule2(input: DeleteRoutingRule2Input!): Routing2!
  updateExpressionGroup2(input: UpdateExpressionGroup2Input!): ExpressionGroup2!
  createBinaryExpression2(input: CreateBinaryExpression2Input!): BinaryExpression2!
  updateBinaryExpression2(input: UpdateBinaryExpression2Input!): BinaryExpression2!
  updateLeftSide2(input: UpdateLeftSide2Input!): BinaryExpression2!
  updateRightSide2(input: UpdateRightSide2Input!): BinaryExpression2!  
  deleteBinaryExpression2(input: DeleteBinaryExpression2Input!): BinaryExpression2!
}

input CreateRouting2Input {
  pageId: ID!
}

input DestinationInput {
  pageId: ID
  sectionId: ID
  logical: LogicalDestination2
}

input UpdateRouting2Input {
  id: ID!
  else: DestinationInput!
}


input CreateRoutingRule2Input {
  routingId: ID!
}

input UpdateRoutingRule2Input { 
  id: ID!
  destination: DestinationInput!
}

input DeleteRoutingRule2Input {
  id: ID!
}

input UpdateExpressionGroup2Input {
  id: ID!
  operator: RoutingOperator2!
}

input CreateBinaryExpression2Input {
  expressionGroupId: ID!
}

input UpdateBinaryExpression2Input {
  id: ID!
  condition: RoutingCondition2!
}

input UpdateLeftSide2Input {
  expressionId: ID!
  answerId: ID
}

input UpdateRightSide2Input {
  expressionId: ID! 
  customValue: CustomRightSideInput
  selectedOptions: [ID!]
}

input DeleteBinaryExpression2Input {
  id: ID!
}

input CustomRightSideInput {
  number: Int
}

input CreateQuestionnaireInput {
  title: String!
  description: String
  theme: String!
  legalBasis: LegalBasis!
  navigation: Boolean
  surveyId: String!
  summary: Boolean
}

input UpdateQuestionnaireInput {
  id: ID!
  title: String
  description: String
  theme: String
  legalBasis: LegalBasis
  navigation: Boolean
  surveyId: String
  summary: Boolean
}

input DeleteQuestionnaireInput {
  id: ID!
}

input UndeleteQuestionnaireInput {
  id: ID!
}

input DuplicateQuestionnaireInput {
  id: ID!
}

input CreateSectionInput {
  title: String!
  alias: String
  questionnaireId: ID!
  position: Int
}

input UpdateSectionInput {
  id: ID!
  title: String
  alias: String
}

input CreateSectionIntroductionInput { 
  sectionId: ID!
  introductionTitle: String
  introductionContent: String
}

input UpdateSectionIntroductionInput { 
  sectionId: ID!
  introductionTitle: String
  introductionContent: String
}

input DeleteSectionIntroductionInput { 
  sectionId: ID!
}

input DeleteSectionInput {
  id: ID!
}

input UndeleteSectionInput {
  id: ID!
}

input DuplicateSectionInput {
  id: ID!
  position: Int!
}

input CreatePageInput {
  title: String!
  description: String
  sectionId: ID!
  position: Int
}

input UpdatePageInput {
  id: ID!
  title: String!
  description: String
}

input DeletePageInput {
  id: ID!
}

input UndeletePageInput {
  id: ID!
}

input DuplicatePageInput {
  id: ID!
  position: Int!
}

input CreateQuestionPageInput {
  title: String!
  alias: String
  description: String
  guidance: String
  sectionId: ID!
  position: Int
  definitionLabel: String
  definitionContent: String
  additionalInfoLabel: String
  additionalInfoContent: String
}

input UpdateQuestionPageInput {
  id: ID!
  alias: String
  title: String
  description: String
  guidance: String
  definitionLabel: String
  definitionContent: String
  additionalInfoLabel: String
  additionalInfoContent: String
}

input DeleteQuestionPageInput {
  id: ID!
}

input UndeleteQuestionPageInput {
  id: ID!
}

input CreateAnswerInput {
  description: String
  guidance: String
  label: String
  secondaryLabel: String
  qCode: String
  type: AnswerType!
  questionPageId: ID!
}

input UpdateAnswerInput {
  id: ID!
  description: String
  guidance: String
  label: String
  secondaryLabel: String
  qCode: String
  type: AnswerType
  properties: JSON
}

input DeleteAnswerInput {
  id: ID!
}

input UndeleteAnswerInput {
  id: ID!
}

input CreateOptionInput {
  label: String
  description: String
  value: String
  qCode: String
  answerId: ID!
  hasAdditionalAnswer: Boolean
}

input CreateMutuallyExclusiveOptionInput {
  label: String
  description: String
  value: String
  qCode: String
  answerId: ID!
}

input UpdateOptionInput {
  id: ID!
  label: String
  description: String
  value: String
  qCode: String
  additionalAnswer: UpdateAnswerInput
}

input DeleteOptionInput {
  id: ID!
}

input UndeleteOptionInput {
  id: ID!
}

input MovePageInput {
  id: ID!
  sectionId: ID!
  position: Int!
}

input MoveSectionInput {
  id: ID!
  questionnaireId: ID!
  position: Int!
}

input CreateRoutingRuleSetInput {
  questionPageId: ID!
}

input UpdateRoutingRuleSetInput {
  id: ID!
  else: RoutingDestinationInput!
}

input DeleteRoutingRuleSetInput {
  id: ID!
}

input ResetRoutingRuleSetElseInput {
  id: ID!
}

input CreateRoutingRuleInput {
  operation: RoutingOperation!
  routingRuleSetId: ID!
}

input UpdateRoutingRuleInput {
  id: ID!
  operation: RoutingOperation
  goto: RoutingDestinationInput
}

input DeleteRoutingRuleInput {
  id: ID!
}

input UndeleteRoutingRuleInput {
  id: ID!
}

input CreateRoutingConditionInput {
  comparator: RoutingComparator!
  questionPageId: ID!
  answerId: ID
  routingRuleId: ID!
}

input UpdateRoutingConditionInput {
  id: ID!
  comparator: RoutingComparator
  questionPageId: ID!
  answerId: ID
}

input DeleteRoutingConditionInput {
  id: ID!
}

input ToggleConditionOptionInput {
  optionId: ID
  conditionId: ID!
  checked: Boolean!
}

input CreateConditionValueInput {
  conditionId: ID!
}

input UpdateConditionValueInput {
  id: ID!
  customNumber: Int
}

input LogicalDestinationInput {
  destinationType: LogicalDestinations!
}

input AbsoluteDestinationInput {
  destinationType: AbsoluteDestinationTypes!
  destinationId: ID!
}

input RoutingDestinationInput {
  logicalDestination: LogicalDestinationInput
  absoluteDestination: AbsoluteDestinationInput
}

input ToggleValidationRuleInput {
  id: ID!
  enabled: Boolean!
}

input UpdateValidationRuleInput {
  id: ID!
  minValueInput:  UpdateMinValueInput
  maxValueInput:  UpdateMaxValueInput
  earliestDateInput: UpdateEarliestDateInput
  latestDateInput: UpdateLatestDateInput
  minDurationInput: UpdateMinDurationInput
  maxDurationInput: UpdateMaxDurationInput
}

input UpdateMinValueInput {
  inclusive: Boolean!
  custom: Int
}

input UpdateMaxValueInput {
  inclusive: Boolean!
  custom: Int
  entityType: ValidationRuleEntityType
  previousAnswer: ID
}

input UpdateEarliestDateInput {
  offset: DurationInput!
  relativePosition: RelativePosition!
  entityType: ValidationRuleEntityType
  custom: Date
  previousAnswer: ID
  metadata: ID
}

input UpdateLatestDateInput {
  offset: DurationInput!
  relativePosition: RelativePosition!
  entityType: ValidationRuleEntityType
  custom: Date
  previousAnswer: ID
  metadata: ID
}

input UpdateMinDurationInput {
  duration: DurationInput!
}

input UpdateMaxDurationInput {
  duration: DurationInput!
}

input DurationInput {
  value: Int
  unit: DurationUnit!
}

input CreateMetadataInput {
    questionnaireId: ID!
}

input DeleteMetadataInput {
    id: ID!
}

input UpdateMetadataInput {
    id: ID!
    key: String
    alias: String
    type: MetadataType!
    dateValue: Date
    regionValue: Region
    languageValue: Language
    textValue: String
}

input ConfirmationOptionInput {
  label: String
  description: String
}

input UpdateQuestionConfirmationInput {
  id: ID!
  title: String
  positive: ConfirmationOptionInput!
  negative: ConfirmationOptionInput!
}

input CreateQuestionConfirmationInput {
  pageId: ID!
}

input DeleteQuestionConfirmationInput {
  id: ID!
}

input UndeleteQuestionConfirmationInput {
  id: ID!
}

`;
