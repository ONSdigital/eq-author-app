const { isNil, isEmpty } = require("lodash/fp");
const jwt = require("jsonwebtoken");

const { getUserByExternalId } = require("../../db/datastore");

const verifyServiceRequest = require("./verifyServiceRequest");
const verifyJwtToken = require("./verifyJwtToken");

module.exports = (logger) => async (authHeader) => {
  if (isNil(authHeader)) {
    logger.error("Request must contain a valid authorization header.");
    return;
  }

  const accessToken = authHeader.replace("Bearer ", "").replace(/=/g, "");
  if (isEmpty(accessToken)) {
    logger.error("Request must contain a valid access token.");
    return;
  }

  const decodedToken = jwt.decode(accessToken, { complete: true });
  if (isNil(decodedToken)) {
    logger.error("Could not decode JWT token.");
    return;
  }

  const { header, payload } = decodedToken;

  if (payload.serviceName) {
    await verifyServiceRequest(accessToken, payload.serviceName);
    return {
      id: payload.serviceName,
      name: payload.serviceName,
      isVerified: true,
    };
  }

  const isVerifiedToken = await verifyJwtToken(
    accessToken,
    header,
    payload.user_id,
    logger
  );

  if (!isVerifiedToken) {
    logger.error("Invalid JWT token.");
    return;
  }

  const unverifiedUser = {
    name: payload.name,
    externalId: payload.sub,
    email: payload.email,
    isVerified: false,
    admin: payload.admin || false,
    emailVerified: payload.email_verified,
  };

  const dbUser = await getUserByExternalId(payload.sub);
  if (!dbUser) {
    return unverifiedUser;
  }

  return {
    ...unverifiedUser,
    id: dbUser.id,
    starredQuestionnaires: dbUser.starredQuestionnaires || [],
    isVerified: true,
  };
};
