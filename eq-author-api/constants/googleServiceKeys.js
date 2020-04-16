const { logger } = require("../utils/logger");

module.exports.VERIFY_PUBLIC_KEYS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

const JwtAlgorithms = ["RS256"];
const JwtTokenIssUrl = "https://securetoken.google.com";

if (!process.env.FIREBASE_PROJECT_ID) {
  logger.fatal(
    {
      file: __filename,
    },
    "FIREBASE_PROJECT_ID env variable needs to be set for firebase token verification"
  );
  process.exit(1);
}

module.exports.VERIFY_VALIDITY_OPTIONS = {
  algorithms: JwtAlgorithms,
  audience: process.env.FIREBASE_PROJECT_ID,
  issuer: `${JwtTokenIssUrl}/${process.env.FIREBASE_PROJECT_ID}`,
  ignoreExpiration: false,
  ignoreNotBefore: false,
};
