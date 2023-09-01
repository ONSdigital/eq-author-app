const { GoogleAuth } = require("google-auth-library");
const { logger } = require("../../../utils/logger");
const fetch = require("node-fetch");

const targetAudience = process.env.SUPPLEMENTARY_DATA_GATEWAY_AUDIENCE;

const auth = new GoogleAuth();

const authorisedRequest = async (url, method = "GET") => {
  try {
    if (!targetAudience) {
      const response = await fetch(url, { method: method });
      return await response.json();
    }
    const client = await auth.getIdTokenClient(targetAudience);
    const res = await client.request({ url, method: method });
    return res.data;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

module.exports = { authorisedRequest };
