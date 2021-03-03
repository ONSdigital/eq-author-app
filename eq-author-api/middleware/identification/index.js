const getUserFromHeaderBuilder = require("./getUserFromHeader");

module.exports = (logger) => {
  const getUserFromHeader = getUserFromHeaderBuilder(logger);
  return async (req, res, next) => {
    const authHeader = req.header(
      process.env.AUTH_HEADER_KEY || "authorization"
    );

    const user = await getUserFromHeader(authHeader);

    if (!user) {
      res.send(401);
      return;
    }

    req.user = user;
    next();
    return;
  };
};
