const Ajv = require("ajv");
const schemas = require("./schemas");

const ajv = new Ajv();

const getPreviousAnswers = (
  sectionIndex,
  pageIndex,
  answerIndex,
  questionnaire
) => {
  // Everything in all previous sections
  const prevSections = questionnaire.sections.slice(0, sectionIndex);
  const prevPages = prevSections.reduce((p, s) => [...p, ...s.pages], []);
  const prevAnswers = prevPages.reduce((a, p) => [...a, ...p.answers], []);

  const selectedSection = questionnaire.sections[sectionIndex];

  // Answers in previous pages in section
  const prevSectionPages = selectedSection.pages.slice(0, pageIndex);
  const prevSectionPagesAnswers = prevSectionPages.reduce(
    (a, p) => [...a, ...p.answers],
    []
  );

  const selectedPage = selectedSection.pages[pageIndex];
  // Previous answers on page
  const prevAnswersOnPage = selectedPage.answers.slice(0, answerIndex);

  return [...prevAnswers, ...prevSectionPagesAnswers, ...prevAnswersOnPage];
};

const getIndex = text => {
  const indexStr = /^\w+\[(\d+)\]$/.exec(text)[1];
  if (!indexStr) {
    return undefined;
  }
  return parseInt(indexStr, 10);
};

ajv.addKeyword("previous", {
  type: "string",
  validate: (
    argument,
    previousAnswerId,
    closeSchema,
    path,
    entity,
    fieldName,
    questionnaire
  ) => {
    const [, sectionPath, pagePath, answerPath] = path.split(".");
    const sectionIndex = getIndex(sectionPath);
    const pageIndex = getIndex(pagePath);
    const answerIndex = getIndex(answerPath);

    const previousAnswers = getPreviousAnswers(
      sectionIndex,
      pageIndex,
      answerIndex,
      questionnaire
    );
    const prevAnswer = previousAnswers.find(a => a.id === previousAnswerId);
    return Boolean(prevAnswer);
  },
});

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

if (validate.errors) {
  throw new Error(validate.errors[0]);
}

module.exports = questionnaire => {
  validate(questionnaire);
  if (validate.errors) {
    console.log("errors", JSON.stringify(validate.errors));
  }
  return {};
};
