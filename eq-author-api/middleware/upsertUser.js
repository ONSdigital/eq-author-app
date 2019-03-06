const { pick, isEqual } = require("lodash/fp");

const { getUserBySub, createUser, updateUser } = require("../utils/datastore");

const checkForUpdates = (user, existingUser) => {
  const pickRequiredFields = pick(["email", "name", "sub", "picture"]);
  return isEqual(pickRequiredFields(user), pickRequiredFields(existingUser));
};

module.exports = async (req, res, next) => {
  try {
    let user = await getUserBySub(req.auth.sub);
    if (!user) {
      user = await createUser(req.auth);
    } else if (!checkForUpdates(user, req.auth)) {
      Object.assign(user, req.auth);
      user = await updateUser(user);
    }
    res.json({ status: "OK" });
  } catch (e) {
    next(e);
  }
};
