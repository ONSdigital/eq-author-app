const { get, head, pick } = require("lodash/fp");
const Section = require("../db/Section");
const db = require("../db");
const {
  getOrUpdateOrderForSectionInsert
} = require("./strategies/spacedOrderStrategy");
const addPrefix = require("../utils/addPrefix");
const { duplicateSectionStrategy } = require("./strategies/duplicateStrategy");

module.exports.findAll = function findAll(
  where = {},
  orderBy = "position",
  direction = "asc"
) {
  return db("SectionsView")
    .select("*")
    .where(where)
    .orderBy(orderBy, direction);
};

module.exports.getById = function getById(id) {
  return db("SectionsView")
    .where("id", parseInt(id, 10))
    .first();
};

module.exports.insert = function insert(args) {
  const { questionnaireId, position } = args;
  return db.transaction(trx => {
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
  return db.transaction(trx => {
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
  return db("SectionsView")
    .count()
    .where({ questionnaireId })
    .then(head)
    .then(get("count"));
};

module.exports.duplicateSection = function duplicateSection(id, position) {
  return db.transaction(async trx => {
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
