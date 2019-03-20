/* eslint-disable camelcase */
const jwt = require("jsonwebtoken");
const yaml = require("js-yaml");
const fs = require("fs");

const SIGNING_ALGORITHM = "RS256";
const keysFile = process.env.KEYS_FILE || "./keys.yml";

module.exports = (req, res, next) => {
  const keysYaml = yaml.safeLoad(fs.readFileSync(keysFile, "utf8"));
  const keysJson = JSON.parse(JSON.stringify(keysYaml));
  const signingKey = keysJson.keys.publisherAuthSigningKey.value;

  const token = jwt.sign(
    {
      user_id: "Publisher",
      name: "Publisher",
      email: "eq.team@ons.gov.uk",
      picture: "",
    },
    signingKey,
    { algorithm: SIGNING_ALGORITHM }
  );

  res.locals.accessToken = token;
  next();
};
