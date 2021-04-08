const { ForbiddenError } = require("apollo-server-express");

const hasWritePermission = (questionnaire, user) =>
  questionnaire.createdBy === user.id ||
  questionnaire.editors.includes(user.id) ||
  user.admin === true;

const enforceHasWritePermission = (questionnaire, user) => {
  if (!hasWritePermission(questionnaire, user)) {
    throw new ForbiddenError(
      "User does not have write permission for this questionnaire"
    );
  }
};

const enforceQuestionnaireLocking = (questionnaire) => {
  if (questionnaire.locked) {
    throw new ForbiddenError("Questionnaire is locked");
  }
};

const enforceHasAdminPermission = (user) => {
  if (!user.admin) {
    throw new ForbiddenError("User does not have admin permission");
  }
};

module.exports = {
  hasWritePermission,
  enforceHasWritePermission,
  enforceHasAdminPermission,
  enforceQuestionnaireLocking,
};
