//This is an auto-generated file.  Do NOT modify the method signature.

const { getUserByName, getUserByEmail } = require("../db/datastore");

const { AUTHOR_TEAM_NAME } = require("../constants/authorTeamUser");

const updateCreatedByToUseUsers = async (questionnaire) => {
  const { createdBy } = questionnaire;

  const user =
    (await getUserByName(createdBy)) || (await getUserByEmail(createdBy));

  if (!user) {
    const defaultUser = await getUserByName(AUTHOR_TEAM_NAME);
    if (!defaultUser) {
      throw new Error(
        `There is no fallback user in the db, add a user with name ${AUTHOR_TEAM_NAME} and try again.`
      );
    }
    questionnaire.createdBy = defaultUser.id;
    return questionnaire;
  }

  questionnaire.createdBy = user.id;
  return questionnaire;
};

module.exports = updateCreatedByToUseUsers;
