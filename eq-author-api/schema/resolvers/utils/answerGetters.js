const { compact, find, flatMap, concat } = require("lodash");
const { getPages } = require("./pageGetters");

const getAnswers = (ctx) => {
  const pageAnswers = flatMap(getPages(ctx), (page) => page.answers);
  const listAnswers = flatMap(
    ctx.questionnaire.collectionLists.lists,
    (list) => list.answers
  );
  return compact(concat(listAnswers, pageAnswers));
};

const getAnswerById = (ctx, id) => find(getAnswers(ctx), { id });

const getOptions = (ctx) =>
  compact(flatMap(getAnswers(ctx), (answer) => answer.options));

const getOptionById = (ctx, id) => find(getOptions(ctx), { id });

module.exports = {
  getAnswers,
  getAnswerById,
  getOptions,
  getOptionById,
};
