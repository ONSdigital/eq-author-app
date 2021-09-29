const { filter, forEach, uniq } = require("lodash/fp");

const {
  SELECTED_ANSWER_DELETED,
} = require("../../constants/routingNoLeftSide");
const { NULL } = require("../../constants/routingNoLeftSide");
const totalableAnswerTypes = require("../../constants/totalableAnswerTypes");
const createGroupValidation = require("./createTotalValidation");
const { getExpressions } = require("../../schema/resolvers/utils");

const removeAnswerFromExpressions = (ctx, deletedAnswer) => {
  const expressions = filter(
    (expression) => expression.left.answerId === deletedAnswer.id,
    getExpressions(ctx)
  );

  forEach((expression) => {
    expression.left.answerId = undefined;
    expression.left.type = NULL;
    expression.left.nullReason = SELECTED_ANSWER_DELETED;
    delete expression.right;
  }, expressions);
};

const removeAnswerGroup = (page, deletedAnswer) => {
  const answerTypes = uniq(page.answers.map((a) => a.type));
  const firstAnswerType = answerTypes[0];
  if (
    answerTypes.length === 1 &&
    page.answers.length > 1 &&
    totalableAnswerTypes.includes(firstAnswerType) &&
    !page.totalValidation
  ) {
    page.totalValidation = createGroupValidation();
    return;
  }

  if (!totalableAnswerTypes.includes(deletedAnswer.type)) {
    return;
  }

  const numberOfType = page.answers.filter(
    (answer) => answer.type === deletedAnswer.type
  ).length;
  if (numberOfType !== 1) {
    return;
  }

  page.totalValidation = null;
};

const removeAnswerFromPiping = (page, deletedAnswer, pages) => {
  pages.map((page) => {
    if (page?.title?.includes(deletedAnswer.id)) {
      page.title = page.title.replace(deletedAnswer.label, "Deleted answer");
    }

    if (page.description.includes(deletedAnswer.id)) {
      page.description = page.description.replace(
        deletedAnswer.label,
        "Deleted answer"
      );
    }
  });
  return pages;
};

module.exports = (ctx, page, deletedAnswer, pages) => {
  removeAnswerFromExpressions(ctx, deletedAnswer);
  removeAnswerGroup(page, deletedAnswer);
  removeAnswerFromPiping(page, deletedAnswer, pages);
};
