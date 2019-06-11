const verifyServiceRequest = require("./verifyServiceRequest");
const { isNil, isEmpty } = require("lodash/fp");
const { getUserByExternalId } = require("../../utils/datastore");
const jwt = require("jsonwebtoken");
const { verifyJwtToken } = require("./verifyJwtToken");

module.exports = logger => async (req, res, next) => {
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

  if (jwtToken.serviceName) {
    await verifyServiceRequest(accessToken, jwtToken.serviceName);
    req.user = {
      id: jwtToken.serviceName,
      name: jwtToken.serviceName,
      isVerified: true,
    };
    next();
    return;
  }

  const verifiedJwtToken = await verifyJwtToken(accessToken);

  if (verifiedJwtToken.error) {
    logger.error("Invalid JWT token.", jwtToken.error);
    res.send(401);
    return;
  }

  let user = await getUserByExternalId(jwtToken.sub);

  if (!user) {
    req.user = {
      name: verifiedJwtToken.name,
      externalId: verifiedJwtToken.sub,
      email: verifiedJwtToken.email,
      isVerified: false,
    };
    next();
    return;
  }

  req.user = {
    id: user.id,
    name: verifiedJwtToken.name,
    externalId: verifiedJwtToken.sub,
    email: verifiedJwtToken.email,
    isVerified: true,
  };

  next();
  return;
};
