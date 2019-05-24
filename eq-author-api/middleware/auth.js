const { isNil, isEmpty } = require("lodash/fp");
const jwt = require("jsonwebtoken");

module.exports = logger => (req, res, next) => {
  if (req.method === "GET") {
    return next();
  }

  const authHeader = req.header(process.env.AUTH_HEADER_KEY || "authorization");
  if (isNil(authHeader)) {
    logger.error("Request must contain a valid authorization header.");
    res.send(401);
    return;
  }

  const accessToken = authHeader.replace("Bearer ", "").replace(/=/g, "");
  if (isEmpty(accessToken)) {
    logger.error("Request must contain a valid access token.");
    res.send(401);
    return;
  }

  const jwtToken = jwt.decode(accessToken);
  if (isNil(jwtToken)) {
    logger.error("Could not decode JWT token.");
    res.send(401);
    return;
  }

  req.auth = jwtToken;
  next();
  return;
};
