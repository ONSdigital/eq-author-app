module.exports = async (req, res, next) => {
  if (!req.user || !req.user.isVerified || !req.user.emailVerified) {
    res.status(401).send("Unauthorised user");
    return;
  }

  next();
};
