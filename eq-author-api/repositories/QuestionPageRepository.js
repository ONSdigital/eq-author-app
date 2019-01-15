const { head } = require("lodash/fp");
const QuestionPage = require("../db/QuestionPage");

const { PIPING_ANSWER_TYPES } = require("../constants/pipingAnswerTypes");
const { ROUTING_ANSWER_TYPES } = require("../constants/routingAnswerTypes");

module.exports = knex => {
  const {
    getPreviousAnswersForPage,
    getPreviousQuestionsForPage,
  } = require("./strategies/previousAnswersStrategy")(knex);

  const getById = function(id) {
    return QuestionPage(knex)
      .findById(id)
      .where({ isDeleted: false });
  };

  const insert = function({
    title,
    alias,
    description,
    guidance,
    sectionId,
    order,
    definitionLabel,
    definitionContent,
  }) {
    return QuestionPage(knex)
      .create({
        title,
        alias,
        description,
        guidance,
        sectionId,
        order,
        definitionLabel,
        definitionContent,
      })
      .then(head);
  };

  const update = function({
    id,
    title,
    alias,
    description,
    guidance,
    isDeleted,
    definitionLabel,
    definitionContent,
  }) {
    return QuestionPage(knex)
      .update(id, {
        title,
        alias,
        description,
        guidance,
        isDeleted,
        definitionLabel,
        definitionContent,
      })
      .then(head);
  };

  const remove = function(id) {
    return QuestionPage(knex)
      .update(id, { isDeleted: true })
      .then(head);
  };

  const undelete = function(id) {
    return QuestionPage(knex)
      .update(id, { isDeleted: false })
      .then(head);
  };

  const getPipingAnswersForQuestionPage = id =>
    getPreviousAnswersForPage({
      id,
      answerTypes: PIPING_ANSWER_TYPES,
    });

  const getPipingMetadataForQuestionPage = id =>
    knex("Metadata")
      .select("Metadata.*")
      .join("Questionnaires", "Metadata.questionnaireId", "Questionnaires.id")
      .join("SectionsView", "SectionsView.questionnaireId", "Questionnaires.id")
      .join("PagesView", "PagesView.sectionId", "SectionsView.id")
      .where("PagesView.id", id)
      .andWhere("Metadata.isDeleted", false)
      .orderBy("Metadata.id", "asc");

  const getRoutingQuestionsForQuestionPage = id =>
    getPreviousQuestionsForPage({
      id,
      answerTypes: ROUTING_ANSWER_TYPES,
      includeSelf: true,
    });

  const getRoutingAnswers = id =>
    getPreviousAnswersForPage({
      id,
      answerTypes: ROUTING_ANSWER_TYPES,
      includeSelf: true,
    });

  return {
    getById,
    insert,
    update,
    remove,
    undelete,
    getPipingAnswersForQuestionPage,
    getPipingMetadataForQuestionPage,
    getRoutingQuestionsForQuestionPage,
    getRoutingAnswers,
  };
};
