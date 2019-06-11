module.exports = async (req, res, next) => {
  if (!req.user.isVerified) {
    res.status(401).send("User does not exist");
    return;
  }

  next();
};
