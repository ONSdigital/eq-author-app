const pubsub = require("../../db/pubSub");
const { saveQuestionnaire } = require("../../utils/datastore");
const validateQuestionnaire = require("../../src/validation");
const { enforceHasWritePermission } = require("./withWritePermission");

const createMutation = mutation => async (root, args, ctx) => {
  enforceHasWritePermission(ctx.questionnaire, ctx.user);
  const result = await mutation(root, args, ctx);
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
