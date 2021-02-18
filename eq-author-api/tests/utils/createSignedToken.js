const jwt = require("jsonwebtoken");
const fs = require("fs");

const {
  VERIFY_VALIDITY_OPTIONS,
} = require("../../constants/googleServiceKeys");

const mockCertPrivate = fs.readFileSync(
  __dirname + "/../../middleware/identification/__mock__/rsa-private.pem"
);

const FIREBASE_ID = process.env.FIREBASE_PROJECT_ID || "TEST_FIREBASE_ID";

const createSignedToken = (userId) => {
  const payload = {
    sub: userId,
    aud: FIREBASE_ID,
    iss: VERIFY_VALIDITY_OPTIONS.issuer,
  };

  return jwt.sign(payload, mockCertPrivate, {
    algorithm: "RS256",
  });
};

module.exports = {
  createSignedToken,
};
