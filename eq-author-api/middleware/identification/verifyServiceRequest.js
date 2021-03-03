const yaml = require("js-yaml");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const keysFile = process.env.KEYS_FILE || "./keys.yml";
const keysYaml = yaml.load(fs.readFileSync(keysFile, "utf8"));
const keysJson = JSON.parse(JSON.stringify(keysYaml));

module.exports = (accessToken, serviceIdentifier) => {
  const verificationKey = keysJson.keys[serviceIdentifier].value;
  jwt.verify(accessToken, verificationKey);
};
