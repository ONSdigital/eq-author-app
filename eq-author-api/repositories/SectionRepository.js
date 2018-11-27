const { get, head, pick } = require("lodash/fp");
const Section = require("../db/Section");
const { getConnection } = require("../db");
const {
  getOrUpdateOrderForSectionInsert
} = require("./strategies/spacedOrderStrategy");
const addPrefix = require("../utils/addPrefix");
const { duplicateSectionStrategy } = require("./strategies/duplicateStrategy");
const {
  getPreviousAnswersForSection
} = require("./strategies/previousAnswersStrategy");

const { PIPING_ANSWER_TYPES } = require("../constants/pipingAnswerTypes");

module.exports.findAll = function findAll(
  where = {},
  orderBy = "position",
  direction = "asc"
) {
  return getConnection()("SectionsView")
    .select("*")
    .where(where)
    .orderBy(orderBy, direction);
};

module.exports.getById = function getById(id) {
  return getConnection()("SectionsView")
    .where("id", parseInt(id, 10))
    .first();
};

module.exports.insert = function insert(args) {
  const { questionnaireId, position } = args;
  return getConnection().transaction(trx => {
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
          "introductionTitle"
        ])
      )
      .then(section => Section.create(section, trx))
      .then(head);
  });
};

module.exports.update = function update({
  id,
  title,
  alias,
  isDeleted,
  introductionContent,
  introductionEnabled,
  introductionTitle
}) {
  return Section.update(id, {
    title,
    alias,
    isDeleted,
    introductionContent,
    introductionEnabled,
    introductionTitle
  }).then(head);
};

module.exports.remove = function remove(id) {
  return Section.update(id, { isDeleted: true }).then(head);
};

module.exports.undelete = function(id) {
  return Section.update(id, { isDeleted: false }).then(head);
};

module.exports.move = function({ id, questionnaireId, position }) {
  return getConnection().transaction(trx => {
    return getOrUpdateOrderForSectionInsert(trx, questionnaireId, id, position)
      .then(order => Section.update(id, { questionnaireId, order }, trx))
      .then(head)

      .then(section => Object.assign(section, { position }));
  });
};

module.exports.getPosition = function({ id }) {
  return this.getById(id)
    .then(get("position"))
    .then(position => {
      if (position) {
        return parseInt(position, 10);
      }
      throw new Error(`No position found for section with id: ${id}`);
    });
};

module.exports.getSectionCount = function getSectionCount(questionnaireId) {
  return getConnection()("SectionsView")
    .count()
    .where({ questionnaireId })
    .then(head)
    .then(get("count"));
};

module.exports.duplicateSection = function duplicateSection(id, position) {
  return getConnection().transaction(async trx => {
    const section = await trx
      .select("*")
      .from("Sections")
      .where({ id })
      .first();

    return duplicateSectionStrategy(trx, section, position, {
      alias: addPrefix(section.alias),
      title: addPrefix(section.title)
    });
  });
};

module.exports.getPipingAnswersForSection = id =>
  this.getById(id).then(({ position: sectionPosition, questionnaireId }) =>
    getPreviousAnswersForSection({
      answerTypes: PIPING_ANSWER_TYPES,
      sectionPosition,
      questionnaireId
    })
  );

module.exports.getPipingMetadataForSection = id =>
  getConnection()("Metadata")
    .select("Metadata.*")
    .join("Questionnaires", "Metadata.questionnaireId", "Questionnaires.id")
    .join("SectionsView", "SectionsView.questionnaireId", "Questionnaires.id")
    .where("SectionsView.id", id)
    .andWhere("Metadata.isDeleted", false);
