const knex = require("../db");
const { head } = require("lodash/fp");
const QuestionPage = require("../db/QuestionPage");
const {
  getPreviousAnswersForPage,
  getPreviousQuestionsForPage
} = require("./strategies/previousAnswersStrategy");

const { PIPING_ANSWER_TYPES } = require("../constants/pipingAnswerTypes");
const { ROUTING_ANSWER_TYPES } = require("../constants/routingAnswerTypes");

module.exports.findAll = function findAll(
  where = {},
  orderBy = "createdAt",
  direction = "asc"
) {
  return QuestionPage.findAll()
    .where({ isDeleted: false })
    .where(where)
    .orderBy(orderBy, direction);
};

module.exports.getById = function getById(id) {
  return QuestionPage.findById(id).where({ isDeleted: false });
};

module.exports.insert = function insert(
  { title, alias, description, guidance, sectionId, order },
  db = knex
) {
  return QuestionPage.create(
    {
      title,
      alias,
      description,
      guidance,
      sectionId,
      order
    },
    db
  ).then(head);
};

module.exports.update = function update({
  id,
  title,
  alias,
  description,
  guidance,
  isDeleted
}) {
  return QuestionPage.update(id, {
    title,
    alias,
    description,
    guidance,
    isDeleted
  }).then(head);
};

module.exports.remove = function remove(id) {
  return QuestionPage.update(id, { isDeleted: true }).then(head);
};

module.exports.undelete = function(id) {
  return QuestionPage.update(id, { isDeleted: false }).then(head);
};

module.exports.getPipingAnswersForQuestionPage = id =>
  getPreviousAnswersForPage({
    id,
    answerTypes: PIPING_ANSWER_TYPES
  });

module.exports.getPipingMetadataForQuestionPage = id =>
  knex("Metadata")
    .select("Metadata.*")
    .join("Questionnaires", "Metadata.questionnaireId", "Questionnaires.id")
    .join("SectionsView", "SectionsView.questionnaireId", "Questionnaires.id")
    .join("PagesView", "PagesView.sectionId", "SectionsView.id")
    .where("PagesView.id", id)
    .andWhere("Metadata.isDeleted", false);

module.exports.getRoutingQuestionsForQuestionPage = id =>
  getPreviousQuestionsForPage({
    id,
    answerTypes: ROUTING_ANSWER_TYPES,
    includeSelf: true
  });
