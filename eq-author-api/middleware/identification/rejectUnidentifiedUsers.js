module.exports = async (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    res.status(401).send("Unauthorised user");
    return;
  }

  next();
};
