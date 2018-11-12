const defaultTypeValueNames = {
  Date: "dateValue",
  Text: "textValue",
  Region: "regionValue",
  Language: "languageValue"
};

const defaultTypeValues = {
  Date: null,
  Text: null,
  Region: "GB_ENG",
  Language: "en"
};

const defaultValues = [
  {
    key: "ru_ref",
    alias: "Ru Ref",
    type: "Text",
    value: "12346789012A"
  },
  {
    key: "ru_name",
    alias: "Ru Name",
    type: "Text",
    value: "ESSENTIAL ENTERPRISE LTD."
  },
  {
    key: "trad_as",
    alias: "Trad As",
    type: "Text",
    value: "ESSENTIAL ENTERPRISE LTD."
  },
  {
    key: "period_id",
    alias: "Period Id",
    type: "Text",
    value: "201605"
  },
  {
    key: "period_str",
    alias: "Period Str",
    type: "Text",
    value: "May 2017"
  },
  {
    key: "language_code",
    alias: "Language",
    type: "Language",
    value: "en"
  },
  {
    key: "ref_p_start_date",
    alias: "Start Date",
    type: "Date",
    value: "01/05/2016"
  },
  {
    key: "ref_p_end_date",
    alias: "End Date",
    type: "Date",
    value: "12/06/2016"
  },
  {
    key: "return_by",
    alias: "Return By",
    type: "Date",
    value: "12/06/2016"
  },
  {
    key: "employmentDate",
    alias: "Employment Date",
    type: "Date",
    value: "10/06/2016"
  },
  {
    key: "region_code",
    alias: "Region",
    type: "Region",
    value: "GB_ENG"
  },
  {
    key: "display_address",
    alias: "Display Address",
    type: "Text",
    value: "68 Abingdon Road, Goathill, PE12 5EH"
  },
  {
    key: "country",
    alias: "Country",
    type: "Text",
    value: "E"
  }
];

Object.assign(module.exports, {
  defaultTypeValueNames,
  defaultTypeValues,
  defaultValues
});
