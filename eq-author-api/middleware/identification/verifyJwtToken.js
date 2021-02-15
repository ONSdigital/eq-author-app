const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const {
  VERIFY_PUBLIC_KEYS_URL,
  VERIFY_VALIDITY_OPTIONS,
} = require("../../constants/googleServiceKeys");

let googlePublicKeys = {};

const fetchUpdatedKeys = async (logger) => {
  logger.info(
    `Fetching latest Google Serice Keys from ${VERIFY_PUBLIC_KEYS_URL}`
  );

  try {
    const response = await fetch(VERIFY_PUBLIC_KEYS_URL);
    googlePublicKeys = await response.json();

    if (googlePublicKeys.error) {
      logger.error(
        "Error fetching Google Service Keys",
        googlePublicKeys.error
      );
    }
  } catch (error) {
    googlePublicKeys = { error };
    logger.error("Error fetching Google Service Keys", error);
  }
};

fetchUpdatedKeys({ info: () => {}, error: () => {} });

const verifyToken = (accessToken, header, userId, logger) => {
  if (!googlePublicKeys || googlePublicKeys.error) {
    return jwt.decode(accessToken);
  }

  const currentPublicKey = googlePublicKeys && googlePublicKeys[header.kid];
  if (!currentPublicKey) {
    return false;
  }

  // Token verification rules as per https://firebase.google.com/docs/auth/admin/verify-id-tokens
  // https://github.com/auth0/node-jsonwebtoken
  try {
    const validDecodedToken = jwt.verify(accessToken, currentPublicKey, {
      ...VERIFY_VALIDITY_OPTIONS,
      subject: userId,
    });
    return validDecodedToken;
  } catch (error) {
    logger.info("Failed token verification", { userId, error });
    return false;
  }
};

module.exports = async function (accessToken, header, userId, logger) {
  // Verify against Google public keys
  return new Promise(async (resolve) => {
    let isVerified = verifyToken(accessToken, header, userId, logger);

    if (!isVerified || googlePublicKeys.error) {
      //Reload keys in case keys have been rotated
      await fetchUpdatedKeys(logger);
      isVerified = verifyToken(accessToken, header, userId, logger);
    }
    resolve(isVerified);
  });
};
