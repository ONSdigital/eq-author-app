const { saveQuestionnaire } = require("../../utils/datastore");
const validateQuestionnaire = require("../../src/validation");

const hasWritePermission = (questionnaire, user) =>
  questionnaire.createdBy === user.id ||
  questionnaire.editors.indexOf(user.id) > -1;

const enforceHasWritePermission = (questionnaire, user) => {
  if (!hasWritePermission(questionnaire, user)) {
    throw new Error(
      "User does not have write permission for this questionnaire"
    );
  }
};

const withWritePermission = mutation => async (root, args, ctx) => {
  enforceHasWritePermission(ctx.questionnaire, ctx.user);
  const result = await mutation(root, args, ctx);
  await saveQuestionnaire(ctx.questionnaire);
  ctx.validationErrorInfo = validateQuestionnaire(ctx.questionnaire);
  return result;
};

module.exports = {
  hasWritePermission,
  enforceHasWritePermission,
  withWritePermission,
};
