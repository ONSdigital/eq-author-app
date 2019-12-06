module.exports = async (req, res, next) => {
  if (req.method === "GET" && process.env.GRAPHQL_USER_BYPASS === "true") {
    next();
    return;
  }

  if (!req.user || !req.user.isVerified) {
    res.status(401).send("Unauthorised user");
    return;
  }

  next();
};
