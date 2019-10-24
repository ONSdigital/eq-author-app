const pubsub = require("../../db/pubSub");
const { PUBLISHED, UNPUBLISHED } = require("../../constants/publishStatus");
const { saveQuestionnaire } = require("../../utils/datastore");
const validateQuestionnaire = require("../../src/validation");
const { enforceHasWritePermission } = require("./withPermissions");
const { AWAITING_APPROVAL } = require("../../constants/publishStatus");

const createMutation = mutation => async (root, args, ctx) => {
  enforceHasWritePermission(ctx.questionnaire, ctx.user);
  if (ctx.questionnaire.publishStatus === AWAITING_APPROVAL) {
    throw new Error(
      "User can not edit questionnaire while waiting for approval"
    );
  }
  const result = await mutation(root, args, ctx);
  if (ctx.questionnaire.publishStatus === PUBLISHED) {
    ctx.questionnaire.publishStatus = UNPUBLISHED;
  }
  await saveQuestionnaire(ctx.questionnaire);
  ctx.validationErrorInfo = validateQuestionnaire(ctx.questionnaire);
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
