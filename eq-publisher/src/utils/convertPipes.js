const cheerio = require("cheerio");
const { flatMap, includes } = require("lodash");
const { unescapePiping } = require("./HTMLUtils");

const getMetadata = (ctx, metadataId) =>
  ctx.questionnaireJson.metadata.find(({ id }) => id === metadataId);

const isPipeableType = answer => {
  const notPipeableDataTypes = ["TextArea", "Radio", "CheckBox"];
  return !includes(notPipeableDataTypes, answer.type);
};

const getAnswer = (ctx, answerId) =>
  flatMap(ctx.questionnaireJson.sections, section =>
    flatMap(section.pages, page =>
      page.answers.filter(answer => isPipeableType(answer))
    )
  ).find(answer => answer.id === answerId);

const FILTER_MAP = {
  Number: value => `${value} | format_number`,
  Currency: (value, unit = "GBP") => `format_currency(${value}, '${unit}')`,
  Date: value => `${value} | format_date`,
  DateRange: value => `${value} | format_date`,
};

const PIPE_TYPES = {
  answers: {
    retrieve: element => element,
    render: ({ id }) => `answers['answer${id}']`,
    getType: ({ type }) => type,
  },
  metadata: {
    retrieve: ({ id }, ctx) => getMetadata(ctx, id.toString()),
    render: ({ key }) => `metadata['${key}']`,
    getType: ({ type }) => type,
  },
};

const convertElementToPipe = ($elem, ctx) => {
  const { piped, ...elementData } = $elem.data();
  const pipeConfig = PIPE_TYPES[piped];
  if (!pipeConfig) {
    return "";
  }

  const entity = pipeConfig.retrieve(elementData, ctx);
  if (!entity) {
    return "";
  }
  const output = pipeConfig.render(entity);
  let dataType = pipeConfig.getType(entity);

  if (!dataType) {
    dataType = getAnswer(ctx, entity.id.toString()).type;
  }

  const filter = FILTER_MAP[dataType];

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
