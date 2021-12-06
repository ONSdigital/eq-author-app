const moment = require("moment");

const { v4: uuidv4 } = require("uuid");

const surveyDetails = (details, bodyText) => {
  const wrapper = (element, body) => `<${element}>${body}</${element}>`;

  const surveyId = `Survey ID - ${wrapper("span", details[0].surveyId)}`;
  const wrappedId = wrapper("li", surveyId);

  const formTypes = details.map((item) => item.formType);
  const joined = formTypes.join(", ");
  const wrappedFormType = wrapper("span", joined);

  const wrappedBodyText = wrapper("div", bodyText);
  const conditionalBodyText = bodyText ? wrappedBodyText : "";

  const conditionalFormType =
    formTypes.length > 1
      ? wrapper("li", `Form types - ${wrappedFormType}`)
      : wrapper("li", `Form type - ${wrappedFormType}`);

  const wrapperTest = wrapper("ul", `${wrappedId}${conditionalFormType}`);
  const detailsAndText = `${wrapperTest}${conditionalBodyText}`;

  return detailsAndText;
};

const formatDate = (date) => moment(date).format("DD/MM/YYYY [at] HH:mm");

const questionnaireCreationEvent = (questionnaire, ctx) => ({
  id: uuidv4(),
  publishStatus: "Questionnaire created",
  questionnaireTitle: `${questionnaire.title} (Version ${questionnaire.surveyVersion})`,
  bodyText: "Imported on: " + formatDate(questionnaire.createdAt),
  type: "system",
  userId: ctx.user.id,
  user: ctx.user,
  time: questionnaire.createdAt,
});

const noteCreationEvent = (ctx, bodyText) => ({
  id: uuidv4(),
  publishStatus: ctx.questionnaire.publishStatus,
  questionnaireTitle: `${ctx.questionnaire.title} (Version ${ctx.questionnaire.surveyVersion})`,
  bodyText,
  type: "note",
  userId: ctx.user.id,
  time: new Date(),
});

const publishStatusEvent = (ctx, bodyText) => {
  const publishDetails = ctx.questionnaire.publishDetails;
  const publishStatus = {
    id: uuidv4(),
    publishStatus: ctx.questionnaire.publishStatus,
    questionnaireTitle: `${ctx.questionnaire.title} (Version ${ctx.questionnaire.surveyVersion})`,
    type: "system",
    userId: ctx.user.id,
    time: new Date(),
  };
  if (publishDetails) {
    const details = surveyDetails(publishDetails, bodyText);
    publishStatus.bodyText = details;
  } else {
    publishStatus.bodyText = bodyText;
  }
  return publishStatus;
};

module.exports = {
  questionnaireCreationEvent,
  noteCreationEvent,
  publishStatusEvent,
  surveyDetails,
};
