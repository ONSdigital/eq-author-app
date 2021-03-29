const { compact, find, flatMap } = require("lodash");
const { getPages } = require("./pageGetters");

const getAnswers = (ctx) =>
  compact(flatMap(getPages(ctx), (page) => page.answers));

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
