const yaml = require("js-yaml");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const keysFile = process.env.KEYS_FILE || "./keys.yml";

module.exports = authHeader => {
  const keysYaml = yaml.safeLoad(fs.readFileSync(keysFile, "utf8"));
  const keysJson = JSON.parse(JSON.stringify(keysYaml));
  const publisherVerificationKey = keysJson.keys.publisherVerificationKey.value;
  const accessToken = authHeader.replace("Bearer ", "").replace(/=/g, "");
  jwt.verify(accessToken, publisherVerificationKey);
};
