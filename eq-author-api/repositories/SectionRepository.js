const { get, head, pick } = require("lodash/fp");
const Section = require("../db/Section");
const {
  getOrUpdateOrderForSectionInsert,
} = require("./strategies/spacedOrderStrategy");
const addPrefix = require("../utils/addPrefix");
const { duplicateSectionStrategy } = require("./strategies/duplicateStrategy");

const { PIPING_ANSWER_TYPES } = require("../constants/pipingAnswerTypes");

module.exports = knex => {
  const {
    getPreviousAnswersForSection,
  } = require("./strategies/previousAnswersStrategy")(knex);

  const findAll = function(
    where = {},
    orderBy = "position",
    direction = "asc"
  ) {
    return knex("SectionsView")
      .select("*")
      .where(where)
      .orderBy(orderBy, direction);
  };

  const getById = function(id) {
    return knex("SectionsView")
      .where("id", parseInt(id, 10))
      .first();
  };

  const insert = function(args) {
    const { questionnaireId, position } = args;
    return knex.transaction(trx => {
      return getOrUpdateOrderForSectionInsert(
        trx,
        questionnaireId,
        null,
        position
      )
        .then(order => Object.assign(args, { order }))
        .then(
          pick([
            "title",
            "alias",
            "questionnaireId",
            "order",
            "introductionContent",
            "introductionEnabled",
            "introductionTitle",
          ])
        )
        .then(section => Section(knex).create(section, trx))
        .then(head);
    });
  };

  const update = function({
    id,
    title,
    alias,
    isDeleted,
    introductionContent,
    introductionEnabled,
    introductionTitle,
  }) {
    return Section(knex)
      .update(id, {
        title,
        alias,
        isDeleted,
        introductionContent,
        introductionEnabled,
        introductionTitle,
      })
      .then(head);
  };

  const remove = function(id) {
    return Section(knex)
      .update(id, { isDeleted: true })
      .then(head);
  };

  const undelete = function(id) {
    return Section(knex)
      .update(id, { isDeleted: false })
      .then(head);
  };

  const move = function({ id, questionnaireId, position }) {
    return knex.transaction(trx => {
      return getOrUpdateOrderForSectionInsert(
        trx,
        questionnaireId,
        id,
        position
      )
        .then(order =>
          Section(knex).update(id, { questionnaireId, order }, trx)
        )
        .then(head)

        .then(section => Object.assign(section, { position }));
    });
  };

  const getPosition = function({ id }) {
    return this.getById(id)
      .then(get("position"))
      .then(position => {
        if (position) {
          return parseInt(position, 10);
        }
        throw new Error(`No position found for section with id: ${id}`);
      });
  };

  const getSectionCount = function(questionnaireId) {
    return knex("SectionsView")
      .count()
      .where({ questionnaireId })
      .then(head)
      .then(get("count"));
  };

  const duplicateSection = function(id, position) {
    return knex.transaction(async trx => {
      const section = await trx
        .select("*")
        .from("Sections")
        .where({ id })
        .first();

      return duplicateSectionStrategy(trx, section, position, {
        alias: addPrefix(section.alias),
        title: addPrefix(section.title),
      });
    });
  };

  const getPipingAnswersForSection = async id => {
    const { position: sectionPosition, questionnaireId } = await getById(id);
    return getPreviousAnswersForSection({
      answerTypes: PIPING_ANSWER_TYPES,
      sectionPosition,
      questionnaireId,
    });
  };

  const getPipingMetadataForSection = id =>
    knex("Metadata")
      .select("Metadata.*")
      .join("Questionnaires", "Metadata.questionnaireId", "Questionnaires.id")
      .join("SectionsView", "SectionsView.questionnaireId", "Questionnaires.id")
      .where("SectionsView.id", id)
      .andWhere("Metadata.isDeleted", false)
      .orderBy("Metadata.id", "asc");

  return {
    findAll,
    getById,
    insert,
    update,
    remove,
    undelete,
    move,
    getPosition,
    getSectionCount,
    duplicateSection,
    getPipingAnswersForSection,
    getPipingMetadataForSection,
  };
};
