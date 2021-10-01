// const { filter, forEach, uniq } = require("lodash/fp");

// const {
//   SELECTED_ANSWER_DELETED,
// } = require("../../constants/routingNoLeftSide");
// const { NULL } = require("../../constants/routingNoLeftSide");
// const totalableAnswerTypes = require("../../constants/totalableAnswerTypes");
// const createGroupValidation = require("./createTotalValidation");
// const { getExpressions } = require("../../schema/resolvers/utils");

// const removeAnswerFromExpressions = (ctx, deletedAnswer) => {
//   const expressions = filter(
//     (expression) => expression.left.answerId === deletedAnswer.id,
//     getExpressions(ctx)
//   );

//   forEach((expression) => {
//     expression.left.answerId = undefined;
//     expression.left.type = NULL;
//     expression.left.nullReason = SELECTED_ANSWER_DELETED;
//     delete expression.right;
//   }, expressions);
// };

// const removeAnswerGroup = (page, deletedAnswer) => {
//   const answerTypes = uniq(page.answers.map((a) => a.type));
//   const firstAnswerType = answerTypes[0];
//   if (
//     answerTypes.length === 1 &&
//     page.answers.length > 1 &&
//     totalableAnswerTypes.includes(firstAnswerType) &&
//     !page.totalValidation
//   ) {
//     page.totalValidation = createGroupValidation();
//     return;
//   }

//   if (!totalableAnswerTypes.includes(deletedAnswer.type)) {
//     return;
//   }

//   const numberOfType = page.answers.filter(
//     (answer) => answer.type === deletedAnswer.type
//   ).length;
//   if (numberOfType !== 1) {
//     return;
//   }

//   page.totalValidation = null;
// };

const updatePipingInAnswers = (oldAnswerLabel, updatedAnswer, pages) => {
  pages.forEach((page) => {
    const { title, description } = page;
    if (title?.includes(updatedAnswer.id)) {
      page.title = title.replace(oldAnswerLabel, updatedAnswer.label);
    }

    if (description?.includes(updatedAnswer.id)) {
      page.description = description.replace(
        oldAnswerLabel,
        updatedAnswer.label
      );
    }
  });
  return pages;
};

module.exports = (ctx, oldAnswerLabel, updatedAnswer, pages) => {
  // removeAnswerFromExpressions(ctx, deletedAnswer);
  // removeAnswerGroup(page, deletedAnswer);
  updatePipingInAnswers(oldAnswerLabel, updatedAnswer, pages);
};
