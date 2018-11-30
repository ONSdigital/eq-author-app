const QuestionnaireRepository = require("./QuestionnaireRepository");
const SectionRepository = require("./SectionRepository");
const PageRepository = require("./PageRepository");
const QuestionPageRepository = require("./QuestionPageRepository");
const AnswerRepository = require("./AnswerRepository");
const OptionRepository = require("./OptionRepository");
const RoutingRepository = require("./RoutingRepository");
const ValidationRepository = require("./ValidationRepository");
const MetadataRepository = require("./MetadataRepository");
const QuestionConfirmationRepository = require("./QuestionConfirmationRepository");

module.exports = knex => {
  return {
    Questionnaire: QuestionnaireRepository(knex),
    Section: SectionRepository(knex),
    Page: PageRepository(knex),
    QuestionPage: QuestionPageRepository(knex),
    Answer: AnswerRepository(knex),
    Option: OptionRepository(knex),
    Routing: RoutingRepository(knex),
    Validation: ValidationRepository(knex),
    Metadata: MetadataRepository(knex),
    QuestionConfirmation: QuestionConfirmationRepository(knex)
  };
};
