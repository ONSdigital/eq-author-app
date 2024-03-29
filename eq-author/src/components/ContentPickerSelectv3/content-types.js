export const ANSWER = "Custom";
export const QUESTION = "Question";
export const METADATA = "Metadata";
export const DESTINATION = "Destination";
export const VARIABLES = "Variables";
export const DYNAMIC_ANSWER = "DynamicAnswer";
export const LIST_ANSWER = "ListAnswer";
export const SUPPLEMENTARY_DATA = "supplementaryData";

export const CONTENT_TYPE_FIELDS = {
  [ANSWER]: "answerId",
  [METADATA]: "metadataId",
};

export const CONTENT_TYPE_LABELS = {
  [ANSWER]: "Answer",
  [METADATA]: "Metadata",
  [LIST_ANSWER]: "Answer from linked collection list",
  [SUPPLEMENTARY_DATA]: "Answer from supplementary data",
};
