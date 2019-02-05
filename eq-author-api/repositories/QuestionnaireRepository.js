const { head } = require("lodash/fp");

const Questionnaire = require("../db/Questionnaire");
const addPrefix = require("../utils/addPrefix");

const {
  duplicateQuestionnaireStrategy,
} = require("./strategies/duplicateStrategy");

module.exports = knex => {
  const getById = function(id) {
    return Questionnaire(knex)
      .findById(id)
      .where({ isDeleted: false });
  };

  const findAll = function findAll(
    where = {},
    orderBy = "createdAt",
    direction = "desc"
  ) {
    return Questionnaire(knex)
      .findAll()
      .where({ isDeleted: false })
      .where(where)
      .orderBy(orderBy, direction);
  };

  const insert = function({
    title,
    description,
    theme,
    legalBasis,
    navigation,
    surveyId,
    summary,
    createdBy,
  }) {
    return Questionnaire(knex)
      .create({
        title,
        description,
        theme,
        legalBasis,
        navigation,
        surveyId,
        summary,
        createdBy,
      })
      .then(head);
  };

  const update = function({
    id,
    title,
    description,
    theme,
    legalBasis,
    navigation,
    surveyId,
    isDeleted,
    summary,
  }) {
    return Questionnaire(knex)
      .update(id, {
        title,
        surveyId,
        description,
        theme,
        legalBasis,
        navigation,
        isDeleted,
        summary,
      })
      .then(head);
  };

  const remove = function(id) {
    return Questionnaire(knex)
      .update(id, { isDeleted: true })
      .then(head);
  };

  const duplicate = (id, createdBy) => {
    return knex.transaction(async trx => {
      const questionnaire = await trx
        .select("*")
        .from("Questionnaires")
        .where({ id })
        .then(head);
      return duplicateQuestionnaireStrategy(trx, questionnaire, {
        title: addPrefix(questionnaire.title),
        createdBy,
      });
    });
  };

  return {
    getById,
    findAll,
    insert,
    update,
    remove,
    duplicate,
  };
};
