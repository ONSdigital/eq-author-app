module.exports = `

scalar Date
scalar DateTime

scalar JSON

directive @deprecated(
  reason: String
) on INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION | ENUM_VALUE | FIELD_DEFINITION | INPUT_OBJECT

directive @client on FIELD

type User {
  id: ID!
  name: String
  picture: String
  email: String
  displayName: String!
  admin: Boolean!
}

type QuestionnaireInfo {
  totalSectionCount: Int!
}

type PublishDetails {
  surveyId: String
  formType: String
  variants: [PublishDetailVariant]
}

type PublishDetailVariant {
  language: String
  theme: String
  authorId: ID
}

enum QuestionnaireType {
  Social
  Business
}

enum Permission {
  Read
  Write
}

type Questionnaire {
  id: ID!
  title: String
  description: String
  starred: Boolean
  additionalGuidancePanelSwitch: Boolean
  additionalGuidancePanel: String
  theme: ThemeShortName
  navigation: Boolean
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User!
  sections: [Section]
  summary: Boolean
  collapsibleSummary: Boolean
  questionnaireInfo: QuestionnaireInfo
  metadata: [Metadata!]!
  type: QuestionnaireType!
  shortTitle: String
  displayName: String!
  introduction: QuestionnaireIntroduction
  editors: [User!]!
  permission: Permission!
  isPublic: Boolean!
  publishStatus: PublishStatus!
  publishDetails: [PublishDetails]
  totalErrorCount: Int!
  surveyId: String
  previewTheme: String!
  themes: [Theme!]!
  locked: Boolean
}

enum HistoryEventTypes {
  system
  note
}

type Theme {
  id: ID!
  enabled: Boolean!
  shortName: ThemeShortName!
  legalBasisCode: LegalBasisCode
  eqId: ID
  formType: String
}

enum LegalBasisCode {
  NOTICE_1
  NOTICE_2
  NOTICE_NI
  VOLUNTARY
}

type History {
  id: ID!
  publishStatus: String!
  questionnaireTitle: String!
  bodyText: String
  type: HistoryEventTypes!
  user: User!
  time: DateTime!
}

enum PublishStatus {
  Published
  Unpublished
  AwaitingApproval
  UpdatesRequired
}

type DeletedQuestionnaire {
  id: ID!
}

type Folder implements Skippable {
  id: ID!
  alias: String
  enabled: Boolean!
  pages: [Page]
  skipConditions: [ExpressionGroup2]
  position: Int!
  section: Section!
  displayName: String!
  validationErrorInfo: ValidationErrorInfo
}

type Section {
  id: ID!
  title: String!
  alias: String
  displayName: String!
  folders: [Folder]
  questionnaire: Questionnaire
  position: Int!
  introductionTitle: String
  introductionContent: String
  validationErrorInfo: ValidationErrorInfo
}

interface Page {
  id: ID!
  title: String!
  alias: String
  displayName: String!
  pageType: PageType!
  folder: Folder!
  section: Section!
  position: Int!
  validationErrorInfo: ValidationErrorInfo
}

interface Skippable {
  id: ID!
  skipConditions: [ExpressionGroup2]
}

type QuestionPage implements Page & Skippable {
  id: ID!
  title: String!
  alias: String
  displayName: String!
  description: String
  descriptionEnabled: Boolean!
  guidance: String
  guidanceEnabled: Boolean!
  pageType: PageType!
  answers: [Answer]
  section: Section!
  folder: Folder!
  position: Int!
  definitionLabel: String
  definitionContent: String
  definitionEnabled: Boolean!
  additionalInfoLabel: String
  additionalInfoContent: String
  additionalInfoEnabled: Boolean!
  confirmation: QuestionConfirmation
  routing: Routing2
  skipConditions: [ExpressionGroup2]
  totalValidation: TotalValidationRule
  validationErrorInfo: ValidationErrorInfo
}

type CalculatedSummaryPage implements Page {
  id: ID!
  title: String!
  alias: String
  displayName: String!
  pageType: PageType!
  qCode: String
  section: Section!
  folder: Folder!
  position: Int!
  summaryAnswers: [Answer!]!
  totalTitle: String
  validationErrorInfo: ValidationErrorInfo
}

type ConfirmationOption {
  id: ID!
  label: String
  description: String
  validationErrorInfo: ValidationErrorInfo
}

type QuestionConfirmation implements Skippable {
  id: ID!
  displayName: String!
  title: String
  page: QuestionPage!
  qCode: String
  positive: ConfirmationOption!
  negative: ConfirmationOption!
  validationErrorInfo: ValidationErrorInfo
  skipConditions: [ExpressionGroup2]
}

interface Answer {
  id: ID!
  displayName: String!
  description: String
  guidance: String
  qCode: String
  label: String
  secondaryLabel: String
  secondaryLabelDefault: String
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
  secondaryQCode: String
  label: String
  secondaryLabel: String
  secondaryLabelDefault: String
  type: AnswerType!
  page: QuestionPage
  properties: JSON
  validation: ValidationType
  validationErrorInfo: ValidationErrorInfo
}

type MultipleChoiceAnswer implements Answer {
  id: ID!
  displayName: String!
  description: String
  guidance: String
  qCode: String
  label: String
  secondaryLabel: String
  secondaryLabelDefault: String
  type: AnswerType!
  options: [Option]
  mutuallyExclusiveOption: Option
  page: QuestionPage
  properties: JSON
  validationErrorInfo: ValidationErrorInfo
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
  validationErrorInfo: ValidationErrorInfo
}

enum LogicalDestinations {
  NextPage
  EndOfQuestionnaire
}

type LogicalDestination {
  id: ID!
  logicalDestination: LogicalDestinations!
}

type ValidationError {
  id: String!
  type: String!
  field: String!
  errorCode: String!
}

type ValidationErrorInfo {
  id: ID!
  errors: [ValidationError!]!
  totalCount: Int!
}


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
  previousAnswer: BasicAnswer
  entityType: ValidationRuleEntityType!
  validationErrorInfo: ValidationErrorInfo
}

type MaxValueValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  inclusive: Boolean!
  custom: Int
  previousAnswer: BasicAnswer
  entityType: ValidationRuleEntityType!
  validationErrorInfo: ValidationErrorInfo
}

type EarliestDateValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  offset: Duration!
  relativePosition: RelativePosition!
  custom: Date
  previousAnswer: BasicAnswer
  metadata: Metadata
  entityType: ValidationRuleEntityType!
  validationErrorInfo: ValidationErrorInfo
}

type LatestDateValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  offset: Duration!
  relativePosition: RelativePosition!
  custom: Date
  previousAnswer: BasicAnswer
  metadata: Metadata
  entityType: ValidationRuleEntityType!
  validationErrorInfo: ValidationErrorInfo
}

type MinDurationValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  duration: Duration!
  validationErrorInfo: ValidationErrorInfo
}

type MaxDurationValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  duration: Duration!
  validationErrorInfo: ValidationErrorInfo
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

type TotalValidationRule implements ValidationRule {
  id: ID!
  enabled: Boolean!
  entityType: ValidationRuleEntityType!
  custom: Int
  previousAnswer: Answer
  condition: ValidationCondition!
  validationErrorInfo: ValidationErrorInfo
}

enum ValidationCondition {
  GreaterThan
  GreaterOrEqual
  Equal
  LessOrEqual
  LessThan
}

enum PageType {
  QuestionPage
  InterstitialPage
  CalculatedSummaryPage
}

enum AnswerType {
  Checkbox
  Currency
  Date
  DateRange
  Duration
  MonthYearDate
  Number
  Percentage
  Radio
  Relationship
  TextArea
  TextField
  Unit
}

enum ThemeShortName {
  default
  social
  census
  northernireland
}

type Metadata {
  id: ID!
  key: String
  fallbackKey: String
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
  Text_Optional
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
  Default
  NextPage
  EndOfQuestionnaire
}

type Destination2 {
  id: ID!
  section: Section
  page: Page
  folder: Folder
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
  validationErrorInfo: ValidationErrorInfo
}

enum RoutingOperator2 {
  And
  Or
}

union Expression2 = BinaryExpression2 | ExpressionGroup2

type ExpressionGroup2 {
  id: ID!
  operator: RoutingOperator2
  expressions: [Expression2!]!
  validationErrorInfo: ValidationErrorInfo
}

enum NoLeftSideReason {
  SelectedAnswerDeleted
  NoRoutableAnswerOnPage
  DefaultRouting
  DefaultSkipCondition
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

enum LogicCondition {
  Equal
  NotEqual
  GreaterThan
  LessThan
  GreaterOrEqual
  LessOrEqual
  OneOf
  AllOf
  AnyOf
  NotAnyOf
  NotAllOf
  Unanswered
}

type BinaryExpression2 {
  id: ID!
  left: LeftSide2
  condition: LogicCondition
  right: RightSide2
  expressionGroup: ExpressionGroup2
  validationErrorInfo: ValidationErrorInfo
}

enum LegalBasis {
  NOTICE_1
  NOTICE_2
  VOLUNTARY
}

type Collapsible {
  id: ID!
  title: String!
  description: String!
  introduction: QuestionnaireIntroduction!
}

type QuestionnaireIntroduction {
  id: ID!
  title: String!
  description: String!
  additionalGuidancePanelSwitch: Boolean
  additionalGuidancePanel: String
  legalBasis: LegalBasis!
  secondaryTitle: String!
  secondaryDescription: String!
  collapsibles: [Collapsible!]!
  tertiaryTitle: String!
  tertiaryDescription: String!
}

type Reply {
  id: ID!
  parentCommentId: ID!
  commentText: String!
  createdTime: DateTime!
  user: User!
  editedTime:  DateTime
}

type Comment {
  id: ID!
  commentText: String!
  createdTime: DateTime!
  user: User!
  replies: [Reply]!
  editedTime: DateTime
}

type Query {
  questionnaires: [Questionnaire]
  questionnaire(input: QueryInput!): Questionnaire
  history(input: QueryInput!): [History!]!
  section(input: QueryInput!): Section
  folder(input: QueryInput!): Folder
  page(input: QueryInput!): Page
  answer(input: QueryInput!): Answer
  answers(ids: [ID]!): [Answer]
  option(input: QueryInput!): Option
  pagesAffectedByDeletion(pageId: ID!): [Page]! @deprecated(reason: "Not implemented")
  questionConfirmation(id: ID!): QuestionConfirmation
  questionnaireIntroduction(id: ID!): QuestionnaireIntroduction
  me: User!
  users: [User!]!
  comments(id: ID!): [Comment!]!
  skippable(input: QueryInput!): Skippable
}

input QueryInput {
  id: ID
  questionnaireId: ID
  sectionId: ID
  folderId: ID
  pageId: ID
  confirmationId: ID
  answerId: ID
  optionId: ID
}

input CreateSkipConditionInput {
  parentId: ID!
}

input DeleteSkipConditionInput {
  id: ID!
}

input DeleteSkipConditionsInput {
  parentId: ID!
}

input UpdateSurveyIdInput {
  questionnaireId: ID!
  surveyId: String!
}

input UpdatePreviewThemeInput {
  questionnaireId: ID!
  previewTheme: String!
}

input EnableThemeInput {
  questionnaireId: ID!
  shortName: ThemeShortName!
}

input DisableThemeInput {
  questionnaireId: ID!
  shortName: ThemeShortName!
}

input UpdateThemeInput {
  questionnaireId: ID!
  shortName: ThemeShortName!
  eqId: ID
  legalBasisCode: LegalBasisCode
  formType: String
}

input ToggleQuestionnaireStarredInput {
  questionnaireId: ID!
}

input SetQuestionnaireLockedInput {
  questionnaireId: ID!
  locked: Boolean!
}

type Mutation {
  createQuestionnaire(input: CreateQuestionnaireInput!): Questionnaire
  updateQuestionnaire(input: UpdateQuestionnaireInput!): Questionnaire
  deleteQuestionnaire(input: DeleteQuestionnaireInput!): DeletedQuestionnaire
  duplicateQuestionnaire(input: DuplicateQuestionnaireInput!): Questionnaire
  setQuestionnaireLocked(input: SetQuestionnaireLockedInput!): Questionnaire

  createHistoryNote(input: createHistoryNoteInput!): [History!]!
  updateHistoryNote(input: updateHistoryNoteInput!): [History!]!
  deleteHistoryNote(input: deleteHistoryNoteInput!): [History!]!

  updateSurveyId(input: UpdateSurveyIdInput!): Questionnaire
  updatePreviewTheme(input: UpdatePreviewThemeInput!): Questionnaire
  enableTheme(input: EnableThemeInput!): Theme
  updateTheme(input: UpdateThemeInput!): Theme
  disableTheme(input: DisableThemeInput!): Theme

  createSection(input: CreateSectionInput!): Section
  updateSection(input: UpdateSectionInput!): Section
  deleteSection(input: DeleteSectionInput!): Questionnaire
  moveSection(input: MoveSectionInput!): Section
  duplicateSection(input: DuplicateSectionInput!): Section

  createFolder(input: CreateFolderInput!): Folder
  updateFolder(input: UpdateFolderInput!): Folder
  deleteFolder(input: DeleteFolderInput!): Section
  moveFolder(input: MoveFolderInput!): Folder
  duplicateFolder(input: DuplicateFolderInput!): Folder

  toggleQuestionnaireStarred(input: ToggleQuestionnaireStarredInput!): Questionnaire

  updatePage(input: UpdatePageInput!): Page
  movePage(input: MovePageInput!): Page
  deletePage(input: DeletePageInput!): Section!
  duplicatePage(input: DuplicatePageInput!): Page
  createComment(input: CreateCommentInput!): Comment!
  deleteComment(input: DeleteCommentInput!): [Comment!]!
  updateComment(input: UpdateCommentInput!): Comment!
  createReply(input: CreateReplyInput!): Reply!
  deleteReply(input: DeleteReplyInput!): [Reply!]!
  updateReply(input: UpdateReplyInput!): Reply!
  createQuestionPage(input: CreateQuestionPageInput!): QuestionPage
  updateQuestionPage(input: UpdateQuestionPageInput!): QuestionPage
  createCalculatedSummaryPage(input: CreateCalculatedSummaryPageInput!): CalculatedSummaryPage!
  updateCalculatedSummaryPage(input: UpdateCalculatedSummaryPageInput!): CalculatedSummaryPage!
  createAnswer(input: CreateAnswerInput!): Answer
  updateAnswer(input: UpdateAnswerInput!): Answer
  deleteAnswer(input: DeleteAnswerInput!): QuestionPage!
  updateAnswersOfType(input: UpdateAnswersOfTypeInput!): [Answer!]!
  moveAnswer(input: MoveAnswerInput!): Answer!
  createOption(input: CreateOptionInput!): Option
  createMutuallyExclusiveOption(input: CreateMutuallyExclusiveOptionInput!): Option
  moveOption(input: MoveOptionInput!): MultipleChoiceAnswer!
  updateOption(input: UpdateOptionInput!): Option
  deleteOption(input: DeleteOptionInput!): MultipleChoiceAnswer
  toggleValidationRule(input: ToggleValidationRuleInput!): ValidationRule!
  updateValidationRule(input: UpdateValidationRuleInput!): ValidationRule!
  createMetadata(input: CreateMetadataInput!): Metadata!
  updateMetadata(input: UpdateMetadataInput!): Metadata!
  deleteMetadata(input: DeleteMetadataInput!): Metadata!
  createQuestionConfirmation(input: CreateQuestionConfirmationInput): QuestionConfirmation!
  updateQuestionConfirmation(input: UpdateQuestionConfirmationInput): QuestionConfirmation!
  deleteQuestionConfirmation(input: DeleteQuestionConfirmationInput): QuestionConfirmation!
  createRouting2(input: CreateRouting2Input!): Routing2!
  updateRouting2(input: UpdateRouting2Input!): Routing2!
  createRoutingRule2(input: CreateRoutingRule2Input!): RoutingRule2!
  updateRoutingRule2(input: UpdateRoutingRule2Input!): RoutingRule2!
  deleteRoutingRule2(input: DeleteRoutingRule2Input!): QuestionPage!
  updateExpressionGroup2(input: UpdateExpressionGroup2Input!): ExpressionGroup2!
  createBinaryExpression2(input: CreateBinaryExpression2Input!): BinaryExpression2!
  updateBinaryExpression2(input: UpdateBinaryExpression2Input!): BinaryExpression2!
  updateLeftSide2(input: UpdateLeftSide2Input!): BinaryExpression2!
  updateRightSide2(input: UpdateRightSide2Input!): BinaryExpression2!
  deleteBinaryExpression2(input: DeleteBinaryExpression2Input!): ExpressionGroup2!
  updateQuestionnaireIntroduction(input: UpdateQuestionnaireIntroductionInput): QuestionnaireIntroduction!
  createCollapsible(input: CreateCollapsibleInput!): Collapsible!
  updateCollapsible(input: UpdateCollapsibleInput!): Collapsible!
  moveCollapsible(input: MoveCollapsibleInput!): Collapsible!
  deleteCollapsible(input: DeleteCollapsibleInput!): QuestionnaireIntroduction!
  triggerPublish(input: PublishQuestionnaireInput!): Questionnaire!
  reviewQuestionnaire(input: ReviewQuestionnaireInput!): Questionnaire!
  createSkipCondition(input: CreateSkipConditionInput!): Skippable
  deleteSkipCondition(input: DeleteSkipConditionInput!): Skippable
  deleteSkipConditions(input: DeleteSkipConditionsInput!): Skippable
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
  operator: RoutingOperator2
}

input CreateBinaryExpression2Input {
  expressionGroupId: ID!
}

input UpdateBinaryExpression2Input {
  id: ID!
  condition: LogicCondition!
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
  additionalGuidancePanelSwitch: Boolean
  additionalGuidancePanel: String
  theme: String!
  navigation: Boolean
  surveyId: String!
  summary: Boolean
  type: QuestionnaireType!
  shortTitle: String
  isPublic: Boolean
}

input UpdateQuestionnaireInput {
  id: ID!
  title: String
  description: String
  additionalGuidancePanelSwitch: Boolean
  additionalGuidancePanel: String
  theme: String
  legalBasis: LegalBasis
  navigation: Boolean
  surveyId: String
  summary: Boolean
  collapsibleSummary: Boolean
  shortTitle: String
  editors: [ID!] 
  isPublic: Boolean
}


input DeleteQuestionnaireInput {
  id: ID!
}

input DuplicateQuestionnaireInput {
  id: ID!
}

input createHistoryNoteInput {
  id: ID!
  bodyText: String!
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
  introductionTitle: String
  introductionContent: String
}

input DeleteSectionInput {
  id: ID!
}

input DuplicateSectionInput {
  id: ID!
  position: Int!
}

input CreateFolderInput {
  sectionId: ID!
  alias: String
  position: Int
  enabled: Boolean
  isCalcSum: Boolean
}

input UpdateFolderInput {
  folderId: ID!
  alias: String
  enabled: Boolean
}

input DeleteFolderInput {
  id: ID!
}

input DuplicateFolderInput {
  id: ID!
  position: Int!
}

input UpdatePageInput {
  id: ID!
  title: String!
  description: String
}

input DeletePageInput {
  id: ID!
}

input DuplicatePageInput {
  id: ID!
  position: Int!
}

input CreateCommentInput {
  componentId: ID!
  commentText: String!
}

input DeleteCommentInput {
  componentId: ID!
  commentId: ID!
}

input UpdateCommentInput {
  componentId: ID!
  commentId: ID!
  commentText: String!
}

input CreateReplyInput {
    componentId: ID!
    commentId: ID!
    commentText: String!
  }

input DeleteReplyInput {
  componentId: ID!
  commentId: ID!
  replyId: ID!
}

input UpdateReplyInput {
  componentId: ID!
  commentId: ID!
  replyId: ID!
  commentText: String!
}

input CreateQuestionPageInput {
  title: String
  alias: String
  description: String
  descriptionEnabled: Boolean
  guidance: String
  guidanceEnabled: Boolean
  folderId: ID!
  position: Int
  definitionLabel: String
  definitionContent: String
  definitionEnabled: Boolean
  additionalInfoLabel: String
  additionalInfoContent: String
  additionalInfoEnabled: Boolean
}

input UpdateQuestionPageInput {
  id: ID!
  alias: String
  title: String
  description: String
  descriptionEnabled: Boolean
  guidance: String
  guidanceEnabled: Boolean
  definitionLabel: String
  definitionContent: String
  definitionEnabled: Boolean
  additionalInfoLabel: String
  additionalInfoContent: String
  additionalInfoEnabled: Boolean
}

input CreateCalculatedSummaryPageInput {
  folderId: ID!
  position: Int
}

input UpdateCalculatedSummaryPageInput {
  id: ID!
  alias: String
  title: String
  totalTitle: String
  qCode: String
  summaryAnswers: [ID!]
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
  secondaryQCode: String
  properties: JSON
}

input UpdateAnswersOfTypeInput {
  questionPageId: ID!
  type: AnswerType!
  properties: JSON!
}

input DeleteAnswerInput {
  id: ID!
}

input MoveAnswerInput {
  id: ID!
  position: Int!
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

input MoveOptionInput {
  id: ID!
  position: Int!
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

input MoveSectionInput {
  id: ID!
  questionnaireId: ID!
  position: Int!
}

input MoveFolderInput {
  id: ID!
  position: Int!
}

input MovePageInput {
  id: ID!
  sectionId: ID!
  folderId: ID
  position: Int!
}

input ToggleValidationRuleInput {
  id: ID!
  enabled: Boolean!
}

input UpdateValidationRuleInput {
  id: ID!
  minValueInput: UpdateMinValueInput
  maxValueInput: UpdateMaxValueInput
  earliestDateInput: UpdateEarliestDateInput
  latestDateInput: UpdateLatestDateInput
  minDurationInput: UpdateMinDurationInput
  maxDurationInput: UpdateMaxDurationInput
  totalInput: UpdateTotalValidationInput
}

input UpdateMinValueInput {
  inclusive: Boolean!
  custom: Int
  entityType: ValidationRuleEntityType
  previousAnswer: ID
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

input UpdateTotalValidationInput {
  entityType: ValidationRuleEntityType!
  custom: Int
  previousAnswer: ID
  condition: ValidationCondition!
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
  fallbackKey: String
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
  positive: ConfirmationOptionInput
  negative: ConfirmationOptionInput
  qCode: String
}

input CreateQuestionConfirmationInput {
  pageId: ID!
}

input DeleteQuestionConfirmationInput {
  id: ID!
}

input UpdateQuestionnaireIntroductionInput {
  id: ID!
  title: String!
  additionalGuidancePanelSwitch: Boolean!
  additionalGuidancePanel: String
  description: String!
  legalBasis: LegalBasis!
  secondaryTitle: String!
  secondaryDescription: String!
  tertiaryTitle: String!
  tertiaryDescription: String!
}

input CreateCollapsibleInput {
  introductionId: ID!
  title: String
  description: String
}

input UpdateCollapsibleInput {
  id: ID!
  title: String!
  description: String!
}

input MoveCollapsibleInput {
  id: ID!
  position: Int!
}

input DeleteCollapsibleInput {
  id: ID!
}

type commentSub {
  id: ID!
}

type Subscription {
  validationUpdated(id: ID!): Questionnaire!
  publishStatusUpdated(id: ID!): Questionnaire!
  commentsUpdated(id: ID!): commentSub!
}

input PublishQuestionnaireInput {
  questionnaireId: ID!
  surveyId: String!
  variants: [PublishDetailsInput]!
}

input PublishDetailsInput {
  theme: String
  formType: String
}

enum ReviewAction {
  Approved
  Rejected
}

input ReviewQuestionnaireInput {
  questionnaireId: ID!
  reviewAction: ReviewAction!
  reviewComment: String
}

input updateHistoryNoteInput {
  questionnaireId: ID!
  bodyText: String!
  id: ID!
}

input deleteHistoryNoteInput {
  questionnaireId: ID!
  id: ID!
}
`;
