const verifyPublisherRequest = require("../utils/verifyPublisherRequest");
const jwt = require("jsonwebtoken");
const yaml = require("js-yaml");
const fs = require("fs");
const SIGNING_ALGORITHM = "RS256";

describe("verifyPublisherRequest", () => {
  let validKey, invalidKey, auth;
  beforeAll(() => {
    const keysYaml = yaml.safeLoad(fs.readFileSync("./keys.test.yml", "utf8"));
    const keysJson = JSON.parse(JSON.stringify(keysYaml));
    validKey = keysJson.keys.publisherAuthSigningKey.value;
    invalidKey = keysJson.keys.invalidPublisherAuthSigningKey.value;
    auth = {
      userId: "test_user",
      name: "test_user",
      email: "eq.team@ons.gov.uk",
      picture: "",
    };
  });
  it("should throw if the key is not verified", () => {
    const token = jwt.sign(auth, invalidKey, { algorithm: SIGNING_ALGORITHM });
    try {
      verifyPublisherRequest(token);
    } catch (e) {
      expect(e.message).toEqual("invalid signature");
    }
  });
  it("should successfully return on a successful verification", () => {
    const token = jwt.sign(auth, validKey, { algorithm: SIGNING_ALGORITHM });
    try {
      verifyPublisherRequest(token);
    } catch (e) {
      expect(true).toEqual(false);
    }
  });
});
