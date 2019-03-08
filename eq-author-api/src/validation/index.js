const { flatMap, find } = require("lodash");

const ERRORS = {
  REQUIRED: 1,
  LINKED_ENTITY_DELETED: 2,
};

const getAnswers = questionnaire => {
  return flatMap(questionnaire.sections, section =>
    flatMap(section.pages, page => page.answers)
  );
};

const getAnswer = questionnaire => answerId => {
  const answers = getAnswers(questionnaire);
  return find(answers, { id: answerId });
};

const validateAnswer = (answer, questionnaire) => {
  const validations = [];
  if (
    answer.validation.minValue.previousAnswer &&
    !getAnswer(questionnaire)(answer.validation.minValue.previousAnswer)
  ) {
    validations.push({
      location: "minValue.previousAnswer",
      errorCode: ERRORS.LINKED_ENTITY_DELETED,
    });
  }
  return { [answer.id]: validations };
};

const validatePage = (page, questionnaire, section) => {
  const pageValidations = [];
  if (!page.title) {
    pageValidations.push({ location: "title", errorCode: ERRORS.REQUIRED });
  }

  const answerValidations = page.answers.reduce(
    (validations, answer) => ({
      ...validations,
      ...validateAnswer(answer, questionnaire, section, page),
    }),
    {}
  );

  return {
    [page.id]: [...pageValidations, ...Object.values(answerValidations)],
    ...answerValidations,
  };
};

const validateSection = (section, questionnaire) => {
  const sectionValidations = [];
  if (questionnaire.navigation && !section.title) {
    sectionValidations.push({ location: "title", errorCode: ERRORS.REQUIRED });
  }

  const pageValidations = section.pages.reduce((validations, page) => {
    return { ...validations, ...validatePage(page) };
  }, {});

  return { [section.id]: sectionValidations, ...pageValidations };
};

module.exports = questionnaire => {
  return questionnaire.sections.reduce((validations, section) => {
    return { ...validations, ...validateSection(section, questionnaire) };
  }, {});
};
