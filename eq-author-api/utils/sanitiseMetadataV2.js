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

const today = new Date();
const nextMonth = new Date(today.setMonth(today.getMonth() + 1));

const defaultMetadata = (questionnaireId, tokenIssueTime, schemaUrl) => ({
  version: "v2",
  iat: tokenIssueTime,
  exp: tokenIssueTime + EXPIRY_OFFSET_SECONDS,
  jti: uuidv1(),
  account_service_url: "https://www.ons.gov.uk/",
  case_id: uuidv1(),
  collection_exercise_sid: uuidv1(),
  response_id: uuidv1(),
  tx_id: uuidv1(),
  response_expires_at: nextMonth,
  schema_url: `${schemaUrl}${questionnaireId}?r${tokenIssueTime}`,
  language_code: "en",
  roles: ["dumper"],
  survey_metadata: {
    data: {
      user_id: "UNKNOWN",
      ru_ref: "12346789012A",
      ru_name: "ESSENTIAL ENTERPRISE LTD",
      trad_as: "ESSENTIAL ENTERPRISE LTD",
      period_id: "201605",
      form_type: "H",
      survey_id: "123",
    },
  },
});

module.exports.sanitiseMetadata = (metadata, questionnaire) => {
  const schemaUrl = process.env.PUBLISHER_URL;
  const refinedMetadata = filterUnacceptableMeta(metadata);
  const tokenIssueTime = Math.round(new Date().getTime() / 1000);
  const sanitisedMetadata = defaultMetadata(
    questionnaire.id,
    tokenIssueTime,
    schemaUrl
  );
  sanitisedMetadata.survey_metadata.data = assign(
    sanitisedMetadata.survey_metadata.data,
    refinedMetadata
  );
  sanitisedMetadata.survey_metadata.data.survey_id = questionnaire.surveyId;
  return sanitisedMetadata;
};
