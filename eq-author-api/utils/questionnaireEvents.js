const uuid = require("uuid");

const questionnaireCreationEvent = (questionnaire, ctx) => ({
  id: uuid.v4(),
  publishStatus: "Questionnaire created",
  questionnaireTitle: questionnaire.title,
  userId: ctx.user.id,
  time: questionnaire.createdAt,
});

const noteCreationEvent = (ctx, bodyText) => ({
  id: uuid.v4(),
  publishStatus: ctx.questionnaire.publishStatus,
  questionnaireTitle: ctx.questionnaire.title,
  bodyText,
  userId: ctx.user.id,
  time: new Date(),
});

module.exports = {
  questionnaireCreationEvent,
  noteCreationEvent,
};
