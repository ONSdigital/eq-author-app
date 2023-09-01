require("dotenv").config();
const program = require("commander");
const { GoogleAuth } = require("google-auth-library");
const { logger } = require("../utils/logger");
const fs = require("fs");

program
  .description("A utility that applies the admin role to a firebase user.")
  .usage("-s <surveyId> -f <filename>")
  .option("-s, --survey-id <surveyId>", "Survey id for file")
  .option("-f, --filename <filename>", "path to schema file")
  .parse(process.argv);

const options = program.opts();

const schema = JSON.parse(fs.readFileSync(options.filename));

const targetAudience = process.env.SUPPLEMENTARY_DATA_GATEWAY_AUDIENCE;
const url = `${process.env.SUPPLEMENTARY_DATA_GATEWAY}schema?survey_id=${options.surveyId}`;

logger.info(targetAudience);
logger.info(url);
logger.info(options.surveyId);
logger.info(schema);

const auth = new GoogleAuth();

const authorisedRequest = async (url, method = "GET", schema) => {
  try {
    logger.info(`request ${url} with target audience ${targetAudience}`);
    const client = await auth.getIdTokenClient(targetAudience);
    const res = await client.request({
      url,
      method: method,
      data: schema,
      headers: {
        "Content-Type": "application/json",
      },
    });
    logger.info(res.data);
    return res;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

authorisedRequest(url, "POST", schema);
