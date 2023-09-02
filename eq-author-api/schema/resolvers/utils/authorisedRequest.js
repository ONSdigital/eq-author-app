const { GoogleAuth } = require("google-auth-library");
const { logger } = require("../../../utils/logger");
const fetch = require("node-fetch");

const auth = new GoogleAuth();

const authorisedRequest = async (url, targetAudience, options) => {
  try {
    if (!targetAudience) {
      const response = await fetch(url, options);
      const data = await response.json();
      return {
        data: data,
        status: response.status,
      };
    }
    const client = await auth.getIdTokenClient(targetAudience);
    const res = await client.request({ url, options });
    return res;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

module.exports = { authorisedRequest };
