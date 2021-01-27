const verifyServiceRequest = require("./verifyServiceRequest");
const jwt = require("jsonwebtoken");
const yaml = require("js-yaml");
const fs = require("fs");
const SIGNING_ALGORITHM = "RS256";

describe("verifyServiceRequest", () => {
  let validKey, invalidKey, auth;
  beforeAll(() => {
    process.env.KEYS_FILE = "./keys.test.yml";
    const keysYaml = yaml.load(fs.readFileSync("./keys.test.yml", "utf8"));
    const keysJson = JSON.parse(JSON.stringify(keysYaml));
    validKey = keysJson.keys.publisher.value;
    invalidKey = keysJson.keys.notPublisher.value;
    auth = {
      serviceName: "publisher",
    };
  });
  it("should throw if the key is not verified", () => {
    const token = jwt.sign(auth, invalidKey, { algorithm: SIGNING_ALGORITHM });
    try {
      verifyServiceRequest(token, "publisher");
    } catch (e) {
      expect(e.message).toEqual("invalid signature");
      return;
    }
    expect(true).toEqual(false);
  });
  it("should successfully return on a successful verification", () => {
    const token = jwt.sign(auth, validKey, { algorithm: SIGNING_ALGORITHM });
    try {
      verifyServiceRequest(token, "publisher");
    } catch (e) {
      expect(true).toEqual(false);
    }
  });
});
