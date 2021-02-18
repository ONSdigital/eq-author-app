//This is an auto-generated file.  Do NOT modify the method signature.

const { first } = require("lodash");

const { UserModel } = require("../db/datastore");

const { AUTHOR_TEAM_NAME } = require("../constants/authorTeamUser");

const getUserByName = (name) =>
  new Promise((resolve, reject) => {
    UserModel.scan({ name: { eq: name } }).exec((err, user) => {
      if (err) {
        reject(err);
      }
      resolve(first(user));
    });
  });

const getUserByEmail = (email) =>
  new Promise((resolve, reject) => {
    UserModel.scan({ email: { eq: email } }).exec((err, user) => {
      if (err) {
        reject(err);
      }
      resolve(first(user));
    });
  });

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
module.exports.getUserByEmail = getUserByEmail;
module.exports.getUserByName = getUserByName;
