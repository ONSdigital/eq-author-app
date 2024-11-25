const { compact, find, flatMap } = require("lodash");
const { getAnswers } = require("./answerGetters");
const { getPages } = require("./pageGetters");

const getValidationById = (ctx, id) => {
  const answers = getAnswers(ctx);
  const answerValidations = flatMap(answers, (answer) =>
    Object.keys(answer.validation).map((validationType) => {
      const validation = answer.validation[validationType];
      validation.validationType = validationType;
      return validation;
    })
  );

  const pageValidations = compact(
    flatMap(getPages(ctx), (page) => page.totalValidation)
  );
  pageValidations.forEach((validation) => {
    validation.validationType = "total";
  });

  return find([...answerValidations, ...pageValidations], { id: id });
};

const getValidationErrorInfo = (ctx) => ctx.validationErrorInfo;

const returnValidationErrors = (ctx, id, ...conditions) => {
  const errors = conditions.reduce((acc, condition) => {
    acc.push(...getValidationErrorInfo(ctx).filter(condition));
    return acc;
  }, []);

  if (!errors.length) {
    return {
      id,
      errors: [],
      totalCount: 0,
    };
  }

  return {
    id,
    errors,
    totalCount: errors.length,
  };
};

const returnAllValidationErrors = (ctx, id) => {
  const errors = getValidationErrorInfo(ctx);

  if (!errors.length) {
    return {
      id,
      errors: [],
      totalCount: 0,
    };
  }

  return {
    id,
    errors,
    totalCount: errors.length,
  };
};

module.exports = {
  getValidationById,
  getValidationErrorInfo,
  returnValidationErrors,
  returnAllValidationErrors,
};
