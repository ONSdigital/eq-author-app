const verifyServiceRequest = require("./verifyServiceRequest");
const verifyJwtToken = require("./verifyJwtToken");
const { isNil, isEmpty } = require("lodash/fp");
const jwt = require("jsonwebtoken");
const { getUserByExternalId } = require("../../utils/datastore");

module.exports = logger => async (req, res, next) => {
  if (req.method === "GET") {
    next();
    return;
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

  const decodedToken = jwt.decode(accessToken, { complete: true });

  if (isNil(decodedToken)) {
    logger.error("Could not decode JWT token.");
    res.send(401);
    return;
  }

  const { header, payload } = decodedToken;

  if (payload.serviceName) {
    await verifyServiceRequest(accessToken, payload.serviceName);
    req.user = {
      id: payload.serviceName,
      name: payload.serviceName,
      isVerified: true,
    };
    next();
    return;
  }

  const isVerifiedToken = await verifyJwtToken(
    accessToken,
    header,
    payload.user_id,
    logger
  );

  if (!isVerifiedToken) {
    logger.error("Invalid JWT token.");
    res.send(401);
    return;
  }

  let user = await getUserByExternalId(payload.sub);
  if (!user) {
    req.user = {
      name: payload.name,
      externalId: payload.sub,
      email: payload.email,
      isVerified: false,
    };
    next();
    return;
  }

  req.user = {
    id: user.id,
    name: payload.name,
    externalId: payload.sub,
    email: payload.email,
    isVerified: true,
  };

  next();
  return;
};
