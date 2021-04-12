const pubsub = require("../../db/pubSub");
const validateQuestionnaire = require("../../src/validation");
const {
  enforceHasWritePermission,
  enforceQuestionnaireLocking,
} = require("./withPermissions");

const { saveQuestionnaire } = require("../../db/datastore");
const { createHistoryEvent } = require("../../db/datastore");
const { publishStatusEvent } = require("../../utils/questionnaireEvents");

const {
  AWAITING_APPROVAL,
  PUBLISHED,
  UNPUBLISHED,
} = require("../../constants/publishStatus");

const createMutation = (mutation, { ignoreLockStatus = false } = {}) => async (
  root,
  args,
  ctx
) => {
  let hasBeenUnpublished;
  enforceHasWritePermission(ctx.questionnaire, ctx.user); // throws ForbiddenError
  if (!ignoreLockStatus) {
    enforceQuestionnaireLocking(ctx.questionnaire); // throws ForbiddenError
  }
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
    await createHistoryEvent(ctx.questionnaire.id, publishStatusEvent(ctx));
  }

  await saveQuestionnaire(ctx.questionnaire);
  ctx.validationErrorInfo = validateQuestionnaire({
    ...ctx.questionnaire,
    updatedAt: new Date(),
  });

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
