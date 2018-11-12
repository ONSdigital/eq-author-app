/* eslint-disable camelcase*/
const { omit, assign } = require("lodash/fp");
const uuid = require("uuid/v1");
const EXPIRY_OFFSET_SECONDS = 100;

const filterUnacceptableMeta = omit([
  "survey_url",
  "tx_id",
  "iat",
  "exp",
  "eq_id",
  "form_type",
  "account_service_url"
]);

const defaultMetadata = (questionnaireId, tokenIssueTime, surveyUrl) => ({
  tx_id: uuid(),
  jti: uuid(),
  iat: tokenIssueTime,
  exp: tokenIssueTime + EXPIRY_OFFSET_SECONDS,
  user_id: "UNKNOWN",
  case_id: uuid(),
  ru_ref: "12346789012A",
  ru_name: "ESSENTIAL ENTERPRISE LTD",
  trad_as: "ESSENTIAL ENTERPRISE LTD",
  eq_id: questionnaireId,
  collection_exercise_sid: uuid(),
  period_id: "201605",
  form_type: questionnaireId,
  survey_url: `${surveyUrl}${questionnaireId}?r${tokenIssueTime}`
});

module.exports.sanitiseMetadata = (metadata, questionnaireId) => {
  const surveyUrl = process.env.PUBLISHER_URL;
  const refinedMetadata = filterUnacceptableMeta(metadata);
  const tokenIssueTime = Math.round(new Date().getTime() / 1000);
  return assign(
    defaultMetadata(questionnaireId, tokenIssueTime, surveyUrl),
    refinedMetadata
  );
};
