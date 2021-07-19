const { pick, isEqual } = require("lodash/fp");

const {
  createUser,
  updateUser,
  getUserByExternalId,
} = require("../../db/datastore");

const checkForUpdates = (user, existingUser) => {
  const pickRequiredFields = pick([
    "email",
    "name",
    "externalId",
    "picture",
    "starredQuestionnaires",
  ]);
  return isEqual(pickRequiredFields(user), pickRequiredFields(existingUser));
};

module.exports = async (req, res, next) => {
  console.log("next :>> ", next);
  const { user } = req;
  if (!user.isVerified) {
    if (
      process.env.ALLOWED_EMAIL_LIST &&
      process.env.ALLOWED_EMAIL_LIST !== ""
    ) {
      const validEmails = process.env.ALLOWED_EMAIL_LIST.split(",");
      const checkEmail = (domain) => user.email.includes(domain);
      if (!validEmails.some(checkEmail, user.email)) {
        res.status(401).json({ status: "Email not in allowed email list" });
        return;
      }
    }

    await createUser({ ...req.user, starredQuestionnaires: [] });

    res.json({ status: "OK" });
    next();
    return;
  }

  const existingUser = await getUserByExternalId(user.externalId);
  if (!checkForUpdates(existingUser, req.user)) {
    Object.assign(existingUser, req.user);
    await updateUser(existingUser);
  }

  res.json({ status: "OK" });
  next();
  return;
};
