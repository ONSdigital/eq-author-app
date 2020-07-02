const cheerio = require("cheerio");
const { includes } = require("lodash");
const { unescapePiping } = require("./HTMLUtils");

const { UNIT, DATE_RANGE } = require("../constants/answerTypes");
const { unitConversion } = require("../constants/unit-types");
const { getAllAnswers } = require("../utils/finders");

const getMetadata = (ctx, metadataId) =>
  ctx.questionnaireJson.metadata.find(({ id }) => id === metadataId);

const isPipeableType = answer => {
  const notPipeableDataTypes = ["TextArea", "Radio", "CheckBox"];
  return !includes(notPipeableDataTypes, answer.type);
};

const getPipableAnswers = (ctx, answerId) => {
  const uuid = answerId.match(
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}/
  )[0];

  return getAllAnswers(ctx.questionnaireJson)
    .filter(answer => isPipeableType(answer))
    .find(answer => answer.id === uuid);
};

const FILTER_MAP = {
  Number: value => `${value} | format_number`,
  Currency: (value, unit = "GBP") => `format_currency(${value}, '${unit}')`,
  Date: value => `${value} | format_date`,
  DateRange: value => `${value} | format_date`,
  Unit: (value, unit) => `format_unit('${unitConversion[unit]}',${value})`,
};

const PIPE_TYPES = {
  answers: {
    retrieve: ({ id }, ctx) => getPipableAnswers(ctx, id.toString()),
    render: ({ id }) => `answers['answer${id}']`,
    getType: ({ type }) => type,
    getUnit: ({ properties: { unit } }) => unit,
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
  const { piped, type, id } = $elem.data();

  const pipeConfig = PIPE_TYPES[piped];

  if (piped === "variable") {
    return pipeConfig.render();
  }
  if (!pipeConfig) {
    return "";
  }

  const entity = pipeConfig.retrieve({ type, id, piped }, ctx);
  if (!entity) {
    return "";
  }

  const outputToRender = type === DATE_RANGE ? { id } : entity;

  const output = pipeConfig.render(outputToRender);
  const dataType = pipeConfig.getType(entity);
  const filter = FILTER_MAP[dataType];
  let unitType;

  if (dataType === UNIT) {
    unitType = pipeConfig.getUnit(entity);
    return filter ? `{{ ${filter(output, unitType)} }}` : `{{ ${output} }}`;
  } else {
    return filter ? `{{ ${filter(output)} }}` : `{{ ${output} }}`;
  }
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
