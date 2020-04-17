const cheerio = require("cheerio");
const { flatMap, includes, compact } = require("lodash");
const { unescapePiping } = require("./HTMLUtils");

const getMetadata = (ctx, metadataId) =>
  ctx.questionnaireJson.metadata.find(({ id }) => id === metadataId);

const isPipeableType = answer => {
  const notPipeableDataTypes = ["TextArea", "Radio", "CheckBox"];
  return !includes(notPipeableDataTypes, answer.type);
};

const getAllAnswers = questionnaire =>
  flatMap(questionnaire.sections, section =>
    compact(flatMap(section.pages, page => page.answers))
  );

const getAnswer = (ctx, answerId) =>
  getAllAnswers(ctx.questionnaireJson)
    .filter(answer => isPipeableType(answer))
    .find(answer => answer.id === answerId);

const FILTER_MAP = {
  Number: value => `${value} | format_number`,
  Currency: (value, unit = "GBP") => `format_currency(${value}, '${unit}')`,
  Date: value => `${value} | format_date`,
  DateRange: value => `${value} | format_date`,
  Unit: (value, unit = "centimeter") => `format_unit('${unit}',${value})`,
};

const PIPE_TYPES = {
  answers: {
    retrieve: ({ id }, ctx) => getAnswer(ctx, id.toString()),
    render: ({ id }) => `answers['answer${id}']`,
    getType: ({ type }) => type,
  },
  metadata: {
    retrieve: ({ id }, ctx) => getMetadata(ctx, id.toString()),
    render: ({ key }) => `metadata['${key}']`,
    getType: ({ type }) => type,
  },
  variable: {
    render: () => `%(total)s`,
  },
};

const convertElementToPipe = ($elem, ctx) => {
  const { piped, ...elementData } = $elem.data();

  const pipeConfig = PIPE_TYPES[piped];

  if (piped === "variable") {
    return pipeConfig.render();
  }
  if (!pipeConfig) {
    return "";
  }

  const entity = pipeConfig.retrieve(elementData, ctx);
  console.log("\n\nentity = = =", entity);

  if (!entity) {
    return "";
  }
  const output = pipeConfig.render(entity);
  console.log("\n\noutput - -", output);

  const dataType = pipeConfig.getType(entity);

  console.log("\n\ndataType - - ", dataType);

  const filter = FILTER_MAP[dataType];

  console.log("\n\nfilter - - ", filter);

  return filter ? `{{ ${filter(output)} }}` : `{{ ${output} }}`;
};

const parseHTML = html => {
  return cheerio.load(html)("body");
};

const convertPipes = ctx => html => {
  if (!html) {
    return html;
  }

  const $ = parseHTML(html);

  $.find("[data-piped]").each((i, elem) => {
    const $elem = cheerio(elem);
    $elem.replaceWith(convertElementToPipe($elem, ctx));
  });

  return unescapePiping($.html());
};

module.exports = convertPipes;
module.exports.getAllAnswers = getAllAnswers;
