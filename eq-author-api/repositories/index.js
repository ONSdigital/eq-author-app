const QuestionnaireRepository = require("./QuestionnaireRepository");
const SectionRepository = require("./SectionRepository");
const PageRepository = require("./PageRepository");
const QuestionPageRepository = require("./QuestionPageRepository");
const AnswerRepository = require("./AnswerRepository");
const OptionRepository = require("./OptionRepository");
const ValidationRepository = require("./ValidationRepository");
const MetadataRepository = require("./MetadataRepository");
const QuestionConfirmationRepository = require("./QuestionConfirmationRepository");
const Routing2Repository = require("./Routing2Repository");
const Destination = require("./DestinationRepository");
const RoutingRule2 = require("./RoutingRule2Repository");
const ExpressionGroup2 = require("./ExpressionGroup2Repository");
const BinaryExpression2 = require("./BinaryExpression2Repository");
const LeftSide2 = require("./LeftSide2Repository");
const RightSide2 = require("./RightSide2Repository");
const SelectedOptions2 = require("./SelectedOptions2Repository");

module.exports = knex => {
  return {
    Questionnaire: QuestionnaireRepository(knex),
    Section: SectionRepository(knex),
    Page: PageRepository(knex),
    QuestionPage: QuestionPageRepository(knex),
    Answer: AnswerRepository(knex),
    Option: OptionRepository(knex),
    Validation: ValidationRepository(knex),
    Metadata: MetadataRepository(knex),
    QuestionConfirmation: QuestionConfirmationRepository(knex),
    Routing2: Routing2Repository(knex),
    Destination: Destination(knex),
    RoutingRule2: RoutingRule2(knex),
    ExpressionGroup2: ExpressionGroup2(knex),
    BinaryExpression2: BinaryExpression2(knex),
    LeftSide2: LeftSide2(knex),
    RightSide2: RightSide2(knex),
    SelectedOptions2: SelectedOptions2(knex),
  };
};
