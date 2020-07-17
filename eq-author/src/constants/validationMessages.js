export default {
  ERR_VALID_REQUIRED: ({ requiredMsg }) => requiredMsg,
  ERR_CALCULATED_UNIT_INCONSISTENCY: ({ message }) => message,
  ERR_UNIQUE_REQUIRED: ({ label }) => `${label} must be unique`,
  ERR_REQUIRED_WHEN_SETTING: ({ message }) => message,
  ERR_NO_ANSWERS: ({ message }) => message,
};

export const richTextEditorErrors = {
  QUESTION_TITLE_NOT_ENTERED: "Enter a question title",
  CALCSUM_TITLE_NOT_ENTERED: "Enter a calculated summary title",
  CONFIRMATION_TITLE_NOT_ENTERED: "Enter section introduction content",
};

export const sectionErrors = {
  SECTION_TITLE_NOT_ENTERED: "Enter a section title",
  SECTION_INTRO_TITLE_NOT_ENTERED: "Enter a section introduction title",
  SECTION_INTRO_CONTENT_NOT_ENTERED: "Enter section introduction content",
};

export const characterErrors = {
  CHAR_LIMIT_2000_EXCEEDED:
    "Enter a character limit less than or equal to 2000",
  CHAR_MUST_EXCEED_9: "Enter a character limit greater than or equal to 10",
  DECIMAL_MUST_BE_SAME:
    "Enter a decimal that is the same as the associated question page",
};

export const QUESTION_ANSWER_NOT_SELECTED = "Answer required";
export const CALCSUM_ANSWER_NOT_SELECTED = "Answer required";
export const CALCSUM_SUMMARY_ANSWERS_THE_SAME =
  "Select answers that are the same unit type";
export const DATE_LABEL_REQUIRED = "Enter a date label";
export const FORM_TYPES_MUST_BE_UNIQUE = "Enter form types that are unique";

export const EARLIEST_BEFORE_LATEST_DATE =
  "Enter an earliest date that is before the latest date";

export const MAX_GREATER_THAN_MIN =
  "Enter a max value that is greater than min value";

export const DURATION_ERROR_MESSAGE =
  "Enter a min duration that is shorter than the max";

export const MIN_INCLUSIVE_TEXT = "must be more than";
export const MAX_INCLUSIVE_TEXT = "must be less than";

export const binaryExpressionErrors = {
  ANSWER_DELETED: "The answer used in this condition has been deleted",
  NO_ROUTABLE_ANSWERS_AVAILABLE:
    "No routable answers have been added to this question yet",
  NO_OR_ON_MULTIPLE_RADIO:
    "OR condition is not valid when creating multiple radio rules",
  AND_NOT_VALID_WITH_RADIO:
    "AND condition not valid with 'radio button' answer",
  ERR_ANSWER_NOT_SELECTED: {
    errorCode: "ERR_ANSWER_NOT_SELECTED",
    message: "Answer required",
  },
};

export const rightSideErrors = {
  ERR_RIGHTSIDE_NO_VALUE: {
    errorCode: "ERR_RIGHTSIDE_NO_VALUE",
    message: "Enter a valid number",
    optionsMessage: "Select at least one option",
  },
  ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED: {
    errorCode: "ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED",
    message: "All of not allowed in rule with checkbox OR option",
  },
  ERR_RIGHTSIDE_AND_OR_NOT_ALLOWED: {
    errorCode: "ERR_RIGHTSIDE_AND_OR_NOT_ALLOWED",
    message: "All of not allowed in expression with checkbox OR option",
  },
};

export const destinationErrors = {
  ERR_PAGE_MOVED: {
    errorCode: "ERR_PAGE_MOVED",
    message:
      "Select a destination that's in the current section, or is another section",
  },
  ERR_SECTION_MOVED: {
    errorCode: "ERR_SECTION_MOVED",
    message:
      "Select a destination that's in the current section, or is another section",
  },
  ERR_PAGE_DELETED: {
    errorCode: "ERR_PAGE_DELETED",
    message: "This page has been deleted. Select a new destination.",
  },
  ERR_SECTION_DELETED: {
    errorCode: "ERR_SECTION_DELETED",
    message: "This section has been deleted. Select a new destination.",
  },
};

export const MISSING_LABEL = "Enter a label";

export const buildLabelError = (mainString, insString, pos, pos2) => {
  if (
    typeof pos === "undefined" ||
    typeof pos2 === "undefined" ||
    typeof insString === "undefined" ||
    typeof mainString === "undefined"
  ) {
    return "Label error";
  }
  return mainString.slice(0, pos) + insString + mainString.slice(pos2);
};
