const addPrefix = require("../utils/addPrefix");
const { duplicatePageStrategy } = require("./strategies/duplicateStrategy");
const { head, get } = require("lodash/fp");
const Page = require("../db/Page");
const QuestionPageRepository = require("./QuestionPageRepository");
const {
  getOrUpdateOrderForPageInsert
} = require("./strategies/spacedOrderStrategy");

const {
  getAvailableRoutingDestinations,
  handlePageDeleted
} = require("./strategies/routingStrategy");

module.exports = knex => {
  function getRepositoryForType({ pageType }) {
    switch (pageType) {
      case "QuestionPage":
        return QuestionPageRepository(knex);
      default:
        throw new TypeError(`Unknown pageType: '${pageType}'`);
    }
  }

  const findAll = function(
    where = {},
    orderBy = "position",
    direction = "asc"
  ) {
    return knex("PagesView")
      .select("*")
      .where(where)
      .orderBy(orderBy, direction);
  };

  const getById = function(id) {
    return knex("PagesView")
      .where("id", parseInt(id, 10))
      .first();
  };

  const insert = function(args) {
    const repository = getRepositoryForType(args);
    const { sectionId, position } = args;

    return knex.transaction(trx => {
      return getOrUpdateOrderForPageInsert(trx, sectionId, null, position)
        .then(order => Object.assign(args, { order }))
        .then(page => repository.insert(page, trx));
    });
  };

  const update = function(args) {
    const repository = getRepositoryForType(args);
    return repository.update(args);
  };

  const deletePage = async (trx, id) => {
    const deletedPage = await trx("Pages")
      .where({ id: parseInt(id, 10) })
      .update({ isDeleted: true })
      .returning("*")
      .then(head);

    await handlePageDeleted(trx, id);

    return deletedPage;
  };

  const remove = id => knex.transaction(trx => deletePage(trx, id));

  const undelete = function(id) {
    return Page(knex)
      .update(id, { isDeleted: false })
      .then(head);
  };

  const move = function({ id, sectionId, position }) {
    return knex.transaction(trx => {
      return getOrUpdateOrderForPageInsert(trx, sectionId, id, position)
        .then(order => Page(trx).update(id, { sectionId, order }))
        .then(head)
        .then(page => Object.assign(page, { position }));
    });
  };

  const getPosition = function({ id }) {
    return getById(id).then(get("position"));
  };

  const getRoutingDestinations = function(pageId) {
    return knex.transaction(trx =>
      getAvailableRoutingDestinations(trx, pageId)
    );
  };

  const duplicatePage = function(id, position) {
    return knex.transaction(async trx => {
      const page = await trx
        .select("*")
        .from("Pages")
        .where({ id })
        .then(head);

      return duplicatePageStrategy(trx, page, position, {
        alias: addPrefix(page.alias),
        title: addPrefix(page.title)
      });
    });
  };

  return {
    findAll,
    getById,
    insert,
    update,
    deletePage,
    remove,
    undelete,
    move,
    getPosition,
    getRoutingDestinations,
    duplicatePage
  };
};
