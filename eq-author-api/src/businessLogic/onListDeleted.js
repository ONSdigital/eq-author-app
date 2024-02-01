const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");
const { getPages, getSections } = require("../../schema/resolvers/utils");

module.exports = (ctx, list) => {
  const pages = getPages(ctx);
  const sections = getSections(ctx);

  pages.forEach((page) => {
    if (page.listId && page.listId === list.id) {
      page.listId = null;
    }
  });

  sections.forEach((section) => {
    if (section.repeatingSectionListId === list.id) {
      section.repeatingSectionListId = null;
    }
    section.folders.forEach((folder) => {
      if (folder.listId && folder.listId === list.id) {
        folder.listId = "";
      }
    });
  });

  if (list.answers) {
    list.answers.forEach((answer) => {
      onAnswerDeleted(ctx, list, answer, pages);
    });
  }

  if (
    ctx.questionnaire.introduction &&
    (ctx.questionnaire.lists === undefined ||
      ctx.questionnaire.collectionLists.lists.length === 0)
  ) {
    ctx.questionnaire.introduction.disallowPreviewQuestions = false;
  }
};
