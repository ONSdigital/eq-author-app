const pubsub = require("../../db/pubSub");
const validateQuestionnaire = require("../../src/validation");
const { enforceHasWritePermission } = require("./withPermissions");

const { saveQuestionnaire } = require("../../utils/datastore");
const { addEventToHistory } = require("../../utils/datastore");
const {
  changedPublishStatusEvent,
} = require("../../utils/questionnaireEvents");

const {
  AWAITING_APPROVAL,
  PUBLISHED,
  UNPUBLISHED,
} = require("../../constants/publishStatus");

const createMutation = mutation => async (root, args, ctx) => {
  let hasBeenUnpublished;
  enforceHasWritePermission(ctx.questionnaire, ctx.user);
  if (ctx.questionnaire.publishStatus === AWAITING_APPROVAL) {
    throw new Error(
      "User can not edit questionnaire while waiting for approval"
    );
  }
  const result = await mutation(root, args, ctx);
  if (ctx.questionnaire.publishStatus === PUBLISHED) {
    ctx.questionnaire.publishStatus = UNPUBLISHED;
    ctx.questionnaire.surveyVersion++;
    hasBeenUnpublished = true;
    await addEventToHistory(
      ctx.questionnaire.id,
      changedPublishStatusEvent(ctx, ctx.questionnaire.surveyVersion)
    );
  }
  await saveQuestionnaire(ctx.questionnaire);
  ctx.validationErrorInfo = validateQuestionnaire(ctx.questionnaire);
  if (hasBeenUnpublished) {
    pubsub.publish("publishStatusUpdated", {
      questionnaire: ctx.questionnaire,
    });
  }
  pubsub.publish("validationUpdated", {
    questionnaire: ctx.questionnaire,
    validationErrorInfo: ctx.validationErrorInfo,
    user: ctx.user,
  });
  return result;
};

module.exports = {
  createMutation,
};
