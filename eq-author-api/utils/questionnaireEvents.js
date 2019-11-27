const uuid = require("uuid");

const questionnaireCreationEvent = (questionnaire, ctx) => ({
  id: uuid.v4(),
  publishStatus: "Questionnaire created",
  questionnaireTitle: `${questionnaire.title} (Version ${questionnaire.surveyVersion})`,
  userId: ctx.user.id,
  type: "system",
  time: questionnaire.createdAt,
});

const noteCreationEvent = (ctx, bodyText) => ({
  id: uuid.v4(),
  publishStatus: ctx.questionnaire.publishStatus,
  questionnaireTitle: `${ctx.questionnaire.title} (Version ${ctx.questionnaire.surveyVersion})`,
  bodyText,
  type: "note",
  userId: ctx.user.id,
  time: new Date(),
});

const publishStatusEvent = (ctx, bodyText) => ({
  id: uuid.v4(),
  publishStatus: ctx.questionnaire.publishStatus,
  questionnaireTitle: `${ctx.questionnaire.title} (Version ${ctx.questionnaire.surveyVersion})`,
  bodyText,
  type: "system",
  userId: ctx.user.id,
  time: new Date(),
});

module.exports = {
  questionnaireCreationEvent,
  noteCreationEvent,
  publishStatusEvent,
};
