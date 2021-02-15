const hasWritePermission = (questionnaire, user) =>
  questionnaire.createdBy === user.id ||
  questionnaire.editors.indexOf(user.id) > -1 ||
  user.admin === true;

const enforceHasWritePermission = (questionnaire, user) => {
  if (!hasWritePermission(questionnaire, user)) {
    throw new Error(
      "User does not have write permission for this questionnaire"
    );
  }
};

const enforceHasAdminPermission = (user) => {
  if (!user.admin) {
    throw new Error("User does not have admin permission");
  }
};

module.exports = {
  hasWritePermission,
  enforceHasWritePermission,
  enforceHasAdminPermission,
};
