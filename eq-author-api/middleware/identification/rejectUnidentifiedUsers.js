module.exports = async (req, res, next) => {
  if (req.method === "GET") {
    next();
    return;
  }

  if (!req.user || !req.user.isVerified) {
    res.status(401).send("User does not exist");
    return;
  }

  next();
};
