const { v4: uuidv4 } = require("uuid");
const { includes, filter } = require("lodash");

const defaultTypeValueNames = {
  Date: "dateValue",
  Text: "textValue",
  Region: "regionValue",
  Language: "languageValue",
};

const defaultTypeValues = {
  Date: null,
  Text: null,
  Region: "GB_ENG",
  Language: "en",
};

const defaultValues = [
  {
    key: "ru_ref",
    alias: "Ru Ref",
    type: "Text",
    textValue: "12346789012A",
  },
  {
    key: "ru_name",
    alias: "Ru Name",
    type: "Text",
    textValue: "ESSENTIAL ENTERPRISE LTD.",
  },
  {
    key: "trad_as",
    alias: "Trad As",
    type: "Text",
    textValue: "ESSENTIAL ENTERPRISE LTD.",
  },
  {
    key: "period_id",
    alias: "Period Id",
    type: "Text",
    textValue: "201605",
  },
  {
    key: "period_str",
    alias: "Period Str",
    type: "Text",
    textValue: "May 2017",
  },
  {
    key: "language_code",
    alias: "Language",
    type: "Language",
    languageValue: "en",
  },
  {
    key: "ref_p_start_date",
    alias: "Start Date",
    type: "Date",
    dateValue: "2016-05-01",
  },
  {
    key: "ref_p_end_date",
    alias: "End Date",
    type: "Date",
    dateValue: "2016-06-12",
  },
  {
    key: "return_by",
    alias: "Return By",
    type: "Date",
    dateValue: "2016-06-12",
  },
  {
    key: "employment_date",
    alias: "Employment Date",
    type: "Date",
    dateValue: "2016-06-10",
  },
  {
    key: "region_code",
    alias: "Region",
    type: "Region",
    regionValue: "GB_ENG",
  },
  {
    key: "display_address",
    alias: "Display Address",
    type: "Text",
    textValue: "68 Abingdon Road, Goathill, PE12 5EH",
  },
  {
    key: "country",
    alias: "Country",
    type: "Text",
    textValue: "E",
  },
  {
    key: "questionnaire_id",
    alias: "Qquestionnaire ID",
    type: "Text",
    textValue: "8766125739854443",
  },
];

const DEFAULT_BUSINESS_SURVEY_METADATA = filter(defaultValues, ({ key }) =>
  includes(
    [
      "ru_name",
      "trad_as",
      "ref_p_start_date",
      "ref_p_end_date",
      "period_id",
      "employment_date",
    ],
    key
  )
);

const createDefaultBusinessSurveyMetadata = () =>
  DEFAULT_BUSINESS_SURVEY_METADATA.map(metadata => ({
    id: uuidv4(),
    ...metadata,
  }));

Object.assign(module.exports, {
  defaultTypeValueNames,
  defaultTypeValues,
  defaultValues,
  createDefaultBusinessSurveyMetadata,
});
