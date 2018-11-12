const addPrefix = require("../utils/addPrefix");
const { duplicatePageStrategy } = require("./strategies/duplicateStrategy");
const { head, get } = require("lodash/fp");
const Page = require("../db/Page");
const QuestionPageRepository = require("./QuestionPageRepository");
const db = require("../db");
const {
  getOrUpdateOrderForPageInsert
} = require("./strategies/spacedOrderStrategy");

const {
  getAvailableRoutingDestinations,
  handlePageDeleted
} = require("./strategies/routingStrategy");

function getRepositoryForType({ pageType }) {
  switch (pageType) {
    case "QuestionPage":
      return QuestionPageRepository;
    default:
      throw new TypeError(`Unknown pageType: '${pageType}'`);
  }
}

function findAll(where = {}, orderBy = "position", direction = "asc") {
  return db("PagesView")
    .select("*")
    .where(where)
    .orderBy(orderBy, direction);
}

function getById(id) {
  return db("PagesView")
    .where("id", parseInt(id, 10))
    .first();
}

function insert(args) {
  const repository = getRepositoryForType(args);
  const { sectionId, position } = args;

  return db.transaction(trx => {
    return getOrUpdateOrderForPageInsert(trx, sectionId, null, position)
      .then(order => Object.assign(args, { order }))
      .then(page => repository.insert(page, trx));
  });
}

function update(args) {
  const repository = getRepositoryForType(args);
  return repository.update(args);
}

const deletePage = async (trx, id) => {
  const deletedPage = await trx("Pages")
    .where({ id: parseInt(id, 10) })
    .update({ isDeleted: true })
    .returning("*")
    .then(head);

  await handlePageDeleted(trx, id);

  return deletedPage;
};

const remove = id => db.transaction(trx => deletePage(trx, id));

function undelete(id) {
  return Page.update(id, { isDeleted: false }).then(head);
}

function move({ id, sectionId, position }) {
  return db.transaction(trx => {
    return getOrUpdateOrderForPageInsert(trx, sectionId, id, position)
      .then(order => Page.update(id, { sectionId, order }, trx))
      .then(head)
      .then(page => Object.assign(page, { position }));
  });
}

function getPosition({ id }) {
  return getById(id).then(get("position"));
}

function getRoutingDestinations(pageId) {
  return db.transaction(trx => getAvailableRoutingDestinations(trx, pageId));
}

function duplicatePage(id, position) {
  return db.transaction(async trx => {
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
}

Object.assign(module.exports, {
  findAll,
  getById,
  insert,
  update,
  remove,
  undelete,
  move,
  getPosition,
  getRoutingDestinations,
  duplicatePage
});
