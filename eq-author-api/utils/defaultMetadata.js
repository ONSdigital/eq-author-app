const { v4: uuidv4 } = require("uuid");
const { includes, filter } = require("lodash");
const {
  DATE,
  TEXT,
  TEXT_OPTIONAL,
  LANGUAGE,
  REGION,
} = require("../constants/metadataTypes");

const defaultTypeValueNames = {
  [DATE]: "dateValue",
  [TEXT]: "textValue",
  [TEXT_OPTIONAL]: "textValue",
  [REGION]: "regionValue",
  [LANGUAGE]: "languageValue",
};

const defaultTypeValues = {
  [DATE]: null,
  [TEXT]: null,
  [TEXT_OPTIONAL]: null,
  [REGION]: "GB_ENG",
  [LANGUAGE]: "en",
};

const defaultValues = [
  {
    key: "ru_ref",
    alias: "Ru Ref",
    type: TEXT,
    textValue: "12346789012A",
  },
  {
    key: "ru_name",
    alias: "Ru Name",
    type: TEXT,
    textValue: "ESSENTIAL ENTERPRISE LTD.",
  },
  {
    key: "trad_as",
    alias: "Trad As",
    type: TEXT_OPTIONAL,
    textValue: "ESSENTIAL ENTERPRISE LTD.",
  },
  {
    key: "period_id",
    alias: "Period Id",
    type: TEXT,
    textValue: "201605",
  },
  {
    key: "user_id",
    alias: "User Id",
    type: TEXT,
    textValue: "A12345678901",
  },
  {
    key: "period_str",
    alias: "Period Str",
    type: TEXT,
    textValue: "May 2017",
  },
  {
    key: "language_code",
    alias: LANGUAGE,
    type: LANGUAGE,
    languageValue: "en",
  },
  {
    key: "ref_p_start_date",
    alias: "Start Date",
    type: DATE,
    dateValue: "2016-05-01",
  },
  {
    key: "ref_p_end_date",
    alias: "End Date",
    type: DATE,
    dateValue: "2016-06-12",
  },
  {
    key: "return_by",
    alias: "Return By",
    type: DATE,
    dateValue: "2016-06-12",
  },
  {
    key: "employment_date",
    alias: "Employment Date",
    type: DATE,
    dateValue: "2016-06-10",
  },
  {
    key: "region_code",
    alias: REGION,
    type: REGION,
    regionValue: "GB_ENG",
  },
  {
    key: "display_address",
    alias: "Display Address",
    type: TEXT,
    textValue: "68 Abingdon Road, Goathill, PE12 5EH",
  },
  {
    key: "country",
    alias: "Country",
    type: TEXT,
    textValue: "E",
  },
];

const DEFAULT_BUSINESS_SURVEY_METADATA = filter(defaultValues, ({ key }) =>
  includes(
    [
      "ru_ref",
      "ru_name",
      "trad_as",
      "ref_p_start_date",
      "ref_p_end_date",
      "period_id",
      "user_id",
    ],
    key
  )
);

const createDefaultBusinessSurveyMetadata = () =>
  DEFAULT_BUSINESS_SURVEY_METADATA.map((metadata) => ({
    id: uuidv4(),
    ...metadata,
  }));

Object.assign(module.exports, {
  defaultTypeValueNames,
  defaultTypeValues,
  defaultValues,
  createDefaultBusinessSurveyMetadata,
});
