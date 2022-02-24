const { find, some } = require("lodash");

const getLists = (ctx) => {
  return ctx.questionnaire.collectionLists.lists;
};

const getListById = (ctx, id) => find(getLists(ctx), { id });

const getListByAnswerId = (ctx, id) => {
  return find(getLists(ctx), ({ answers }) => answers && some(answers, { id }));
};

module.exports = {
  getLists,
  getListById,
  getListByAnswerId,
};
