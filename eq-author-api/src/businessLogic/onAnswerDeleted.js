const { filter, forEach, uniq } = require("lodash/fp");
const { logger } = require("../../utils/logger");
const {
  SELECTED_ANSWER_DELETED,
} = require("../../constants/routingNoLeftSide");
const { NULL } = require("../../constants/routingNoLeftSide");
const totalableAnswerTypes = require("../../constants/totalableAnswerTypes");
const createGroupValidation = require("./createTotalValidation");
const { getExpressions, getSections } = require("../../schema/resolvers/utils");
const cheerio = require("cheerio");

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
  logger.info(`Removed Answer from Group with id ${deletedAnswer.id}`);

  if (
    answerTypes.length === 1 &&
    page.answers.length > 1 &&
    totalableAnswerTypes.includes(firstAnswerType) &&
    !page.totalValidation
  ) {
    page.totalValidation = createGroupValidation();
    return;
  }

  if (page.answers.length === 0) {
    delete page.totalValidation;
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

const updatePipingValue = (htmlText, answerId, newValue) => {
  if (!htmlText) {
    return htmlText;
  }
  const htmlDoc = cheerio.load(htmlText, null, false);
  const dataSpan = htmlDoc(`span[data-id=${answerId}]`);
  dataSpan.each((i, elem) => {
    elem.children[0].data = `[${newValue}]`;
  });
  return htmlDoc.html();
};

const removeAnswerFromPiping = (ctx, deletedAnswer, pages) => {
  pages.forEach((page) => {
    page.title = updatePipingValue(
      page.title,
      deletedAnswer.id,
      "Deleted answer"
    );
    page.description = updatePipingValue(
      page.description,
      deletedAnswer.id,
      "Deleted answer"
    );
  });

  const sections = getSections(ctx);

  sections.forEach((section) => {
    section.introductionTitle = updatePipingValue(
      section.introductionTitle,
      deletedAnswer.id,
      "Deleted answer"
    );
    section.introductionContent = updatePipingValue(
      section.introductionContent,
      deletedAnswer.id,
      "Deleted answer"
    );
  });

  logger.info(`Removed Answer from Piping with Answer ID ${deletedAnswer.id}`);
  return pages;
};

module.exports = (ctx, page, deletedAnswer, pages) => {
  removeAnswerFromExpressions(ctx, deletedAnswer);
  removeAnswerGroup(page, deletedAnswer);
  removeAnswerFromPiping(ctx, deletedAnswer, pages);
};
