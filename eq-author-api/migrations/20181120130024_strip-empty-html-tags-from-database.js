const { noop, omit, transform } = require("lodash");
const cheerio = require("cheerio");
const { isHtml } = require("../utils/html");

const filterEmptyTags = value => {
  if (isHtml(value)) {
    return cheerio(value)
      .text()
      .trim() === ""
      ? ""
      : value;
  } else {
    return value;
  }
};

const transformResults = resultsArray =>
  resultsArray.map(sqlResult =>
    transform(
      sqlResult,
      (result, value, key) => {
        result[key] = filterEmptyTags(value);
      },
      {}
    )
  );

const updateDb = knex => (updatedResults, tablename) =>
  updatedResults.map(result =>
    knex(tablename)
      .update(omit(result, "id"))
      .where({ id: result.id })
  );

exports.up = async function(knex) {
  const pageResults = await knex("Pages").select(
    "id",
    "title",
    "description",
    "guidance"
  );

  const sectionResults = await knex("Sections").select(
    "id",
    "title",
    "description",
    "introductionTitle",
    "introductionContent"
  );

  const updateResults = updateDb(knex);

  const pagePromises = updateResults(transformResults(pageResults), "Pages");
  const sectionPromises = updateResults(
    transformResults(sectionResults),
    "Sections"
  );

  return Promise.all([...pagePromises, ...sectionPromises]);
};
exports.down = noop;
