/* eslint-disable camelcase*/
const KJUR = require("jsrsasign");
const fs = require("fs");
const JSONWebKey = require("json-web-key");
const { JWK, JWE } = require("node-jose");
const { find, keys, assign, flow, map } = require("lodash/fp");
const yaml = require("js-yaml");
const SIGNING_ALGORITHM = "RS256";
const keysFile = process.env.KEYS_FILE || "./keys.yml";

const getKeyByUse = (json, useCase) =>
  flow(
    keys,
    map(kid => assign(json[kid], { kid })),
    find(keyObject => keyObject.use === useCase)
  )(json);

const keysYaml = yaml.safeLoad(fs.readFileSync(keysFile, "utf8"));
const keysJson = JSON.parse(JSON.stringify(keysYaml));

module.exports.generateToken = function(payload) {
  const signingKeyObject = getKeyByUse(keysJson.keys, "signing");
  const encryptionKeyObject = getKeyByUse(keysJson.keys, "encryption");

  // Header
  const jwtHeader = JSON.stringify({
    alg: SIGNING_ALGORITHM,
    typ: "JWT",
    kid: signingKeyObject.kid
  });

  // Payload
  const jwtPayload = JSON.stringify(payload);

  const prvKey = KJUR.KEYUTIL.getKey(signingKeyObject.value);

  const signedJWT = KJUR.jws.JWS.sign(
    SIGNING_ALGORITHM,
    jwtHeader,
    jwtPayload,
    prvKey
  );

  const webKey = JSONWebKey.fromPEM(encryptionKeyObject.value);

  return JWK.asKey(webKey.toJSON())
    .then(function(jwk) {
      const cfg = {
        contentAlg: "A256GCM"
      };
      const recipient = {
        key: jwk,
        header: {
          alg: "RSA-OAEP",
          kid: encryptionKeyObject.kid
        }
      };
      const jwe = JWE.createEncrypt(cfg, recipient);
      return jwe.update(signedJWT).final();
    })
    .then(
      result =>
        `${result.protected}.${result.recipients[0].encrypted_key}.${
          result.iv
        }.${result.ciphertext}.${result.tag}`
    );
};
