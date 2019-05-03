const { pick, isEqual } = require("lodash/fp");

const {
  createUser,
  updateUser,
  getUserByExternalId,
} = require("../../utils/datastore");

const checkForUpdates = (user, existingUser) => {
  const pickRequiredFields = pick(["email", "name", "externalId", "picture"]);
  return isEqual(pickRequiredFields(user), pickRequiredFields(existingUser));
};

module.exports = async (req, res, next) => {
  const { user } = req;
  if (!user.isVerified) {
    await createUser(req.user);

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
