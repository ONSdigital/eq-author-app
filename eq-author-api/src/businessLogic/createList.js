const { v4: uuidv4 } = require("uuid");

const createList = (ctx) => {
  if (ctx.questionnaire.introduction) {
    ctx.questionnaire.introduction.previewQuestions = false;
    ctx.questionnaire.introduction.disallowPreviewQuestions = true;
  }
  return {
    id: uuidv4(),
    listName: null,
    answers: [],
  };
};

module.exports = createList;
