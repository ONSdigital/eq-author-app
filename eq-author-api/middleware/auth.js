const { isNil, isEmpty } = require("lodash/fp");
const jwt = require("jsonwebtoken");

module.exports = (logger, context) => (req, res, next) => {
  const authHeader = req.header("authorization");
  if (isNil(authHeader)) {
    logger.error("Request must contain a valid authorization header.");
    res.send(401);
    return;
  }

  const accessToken = authHeader.replace("Bearer ", "");
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

  context.auth = jwtToken;
  next();
  return;
};
