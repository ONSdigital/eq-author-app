/* eslint-disable camelcase*/
const { omit, assign } = require("lodash/fp");
const { v1: uuidv1 } = require("uuid");
const EXPIRY_OFFSET_SECONDS = 100;

const filterUnacceptableMeta = omit([
  "survey_url",
  "tx_id",
  "iat",
  "exp",
  "eq_id",
  "form_type",
  "account_service_url",
]);

const defaultMetadata = (questionnaireId, tokenIssueTime, schemaUrl) => ({
  tx_id: uuidv1(),
  jti: uuidv1(),
  iat: tokenIssueTime,
  exp: tokenIssueTime + EXPIRY_OFFSET_SECONDS,
  user_id: "UNKNOWN",
  case_id: uuidv1(),
  ru_ref: "12346789012A",
  ru_name: "ESSENTIAL ENTERPRISE LTD",
  trad_as: "ESSENTIAL ENTERPRISE LTD",
  eq_id: questionnaireId,
  collection_exercise_sid: uuidv1(),
  period_id: "201605",
  schema_url: `${schemaUrl}${questionnaireId}?r${tokenIssueTime}`,
  questionnaire_id: uuidv1(),
  response_id: uuidv1(),
  schema_name: "test",
  language_code: "en",
  form_type: "H",
  account_service_url: "https://www.ons.gov.uk/",
  account_service_log_out_url: "https://www.ons.gov.uk/",
  roles: ["dumper"],
});

module.exports.sanitiseMetadata = (metadata, questionnaireId) => {
  const schemaUrl = process.env.PUBLISHER_URL;
  const refinedMetadata = filterUnacceptableMeta(metadata);
  const tokenIssueTime = Math.round(new Date().getTime() / 1000);
  return assign(
    defaultMetadata(questionnaireId, tokenIssueTime, schemaUrl),
    refinedMetadata
  );
};
