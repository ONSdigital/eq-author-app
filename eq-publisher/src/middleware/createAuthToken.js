const jwt = require("jsonwebtoken");
const yaml = require("js-yaml");
const fs = require("fs");

const SIGNING_ALGORITHM = "RS256";
const keysFile = process.env.KEYS_FILE || "./keys.yml";
const keysYaml = yaml.load(fs.readFileSync(keysFile, "utf8"));
const keysJson = JSON.parse(JSON.stringify(keysYaml));
const signingKey = keysJson.keys.publisherAuthSigningKey.value;

module.exports = (req, res, next) => {
  const token = jwt.sign(
    {
      serviceName: "publisher",
    },
    signingKey,
    { algorithm: SIGNING_ALGORITHM }
  );

  res.locals.accessToken = token;
  next();
};
