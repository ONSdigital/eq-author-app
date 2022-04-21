const { filter, forEach, uniq } = require("lodash/fp");
const { logger } = require("../../utils/logger");
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
  logger.info(`Removed Answer from Group`);

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

const removeAnswerFromPiping = (deletedAnswer, pages) => {
  const deletedAnswerId = deletedAnswer.id;
  pages.forEach((page) => {
    const { title, description } = page;
    if (title?.includes(deletedAnswerId)) {
      page.title = title.replace(deletedAnswer.label, "Deleted answer");
    }

    if (description?.includes(deletedAnswer.id)) {
      page.description = description.replace(
        deletedAnswer.label,
        "Deleted answer"
      );
    }
  });
  logger.info(`Removed Answer from Piping with Answer ID ${deletedAnswerId}`);
  return pages;
};

module.exports = (ctx, page, deletedAnswer, pages) => {
  removeAnswerFromExpressions(ctx, deletedAnswer);
  removeAnswerGroup(page, deletedAnswer);
  removeAnswerFromPiping(deletedAnswer, pages);
};
