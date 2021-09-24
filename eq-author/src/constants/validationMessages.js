export default {
  ERR_VALID_REQUIRED: ({ requiredMsg }) => requiredMsg,
  ERR_CALCULATED_UNIT_INCONSISTENCY: ({ message }) => message,
  ERR_UNIQUE_REQUIRED: ({ label }) => `${label} must be unique`,
  ERR_REQUIRED_WHEN_SETTING: ({ message }) => message,
  ERR_NO_ANSWERS: ({ message }) => message,
};

export const richTextEditorErrors = {
  QUESTION_TITLE_NOT_ENTERED: {
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter a question title",
  },
  CALCSUM_TITLE_NOT_ENTERED: {
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter a calculated summary title",
  },
  CONFIRMATION_TITLE_NOT_ENTERED: "Enter a confirmation question title",
  PIPING_TITLE_MOVED: {
    errorCode: "PIPING_TITLE_MOVED",
    message: "The answer being piped is now later in the questionnaire",
  },
  PIPING_TITLE_DELETED: {
    errorCode: "PIPING_TITLE_DELETED",
    message: "The answer being piped has been deleted",
  },
  PIPING_METADATA_DELETED: {
    errorCode: "PIPING_METADATA_DELETED",
    message: "The metadata being piped has been deleted",
  },
  INCLUDE_EXCLUDE_NOT_ENTERED: {
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter include/exclude content",
  },
  DESCRIPTION_NOT_ENTERED: {
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter a question description",
  },
  ADDITIONAL_INFO_LABEL_NOT_ENTERED: {
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter additional information label",
  },
  ADDITIONAL_INFO_CONTENT_NOT_ENTERED: {
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter additional information content",
  },
};

export const questionDefinitionErrors = {
  DEFINITION_LABEL_NOT_ENTERED: {
    field: "definitionLabel",
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter definition label",
  },
  DEFINITION_CONTENT_NOT_ENTERED: {
    field: "definitionContent",
    errorCode: "ERR_VALID_REQUIRED",
    message: "Enter definition content",
  },
};

export const sectionErrors = {
  SECTION_TITLE_NOT_ENTERED: "Enter a section title",
  SECTION_INTRO_TITLE_NOT_ENTERED: "Enter a section introduction title",
  SECTION_INTRO_CONTENT_NOT_ENTERED: "Enter section introduction content",
};

export const textAreaErrors = {
  ERR_MAX_LENGTH_TOO_LARGE: {
    errorCode: "ERR_MAX_LENGTH_TOO_large",
    message: "Enter a character limit less than or equal to 2000",
  },
  ERR_MAX_LENGTH_TOO_SMALL: {
    errorCode: "ERR_MAX_LENGTH_TOO_SMALL",
    message: "Enter a character limit greater than or equal to 10",
  },
};

export const characterErrors = {
  CHAR_LIMIT_2000_EXCEEDED:
    "Enter a character limit less than or equal to 2000",
  CHAR_MUST_EXCEED_9: "Enter a character limit greater than or equal to 10",
  DECIMAL_MUST_BE_SAME:
    "Enter a decimal that is the same as the associated question page",
};

export const QCODE_IS_NOT_UNIQUE = "Qcode must be unique";
export const QCODE_REQUIRED = "Qcode required";
export const QUESTION_ANSWER_NOT_SELECTED = "Answer required";
export const CALCSUM_ANSWER_NOT_SELECTED =
  "Select at least two answers to be calculated";
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

export const ERR_OFFSET_NO_VALUE = "Value is required";
export const ERR_NO_VALUE = "Value is required";
export const ERR_REFERENCE_DELETED =
  "Answer required. The answer used in this validation has been deleted.";
export const ERR_REFERENCE_MOVED = "Answer must be from a previous question";

export const SELECTION_REQUIRED = "Selection required";

export const OPERATOR_REQUIRED = "Choose an operator";

export const METADATA_REQUIRED = "Metadata is required";
export const DATE_REQUIRED = "Date is required";

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
  ERR_LOGICAL_AND: "AND conditions must not conflict",
};

export const expressionGroupErrors = {
  ERR_VALUE_REQUIRED: "Selection required",
};

export const leftSideErrors = {
  ERR_LEFTSIDE_NO_LONGER_AVAILABLE: {
    errorCode: "ERR_LEFTSIDE_NO_LONGER_AVAILABLE",
    message: "Select an answer that is not later on in the questionnaire",
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
  ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE: {
    errorCode: "ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE",
    message:
      "You can't match 'All of' the standard options with the 'or' checkbox option. Change the 'All of' to 'Any of' or remove all of the standard options or the 'or' checkbox option",
  },
  ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND: {
    errorCode: "ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND",
    message:
      "You can't match 'All of' the standard options with the 'or' checkbox option. Change the 'All of' to 'Any of' or remove a condition",
  },
};

export const destinationErrors = {
  ERR_DESTINATION_MOVED: {
    errorCode: "ERR_DESTINATION_MOVED",
    message:
      "Select a destination that's later in the current section, or is another section",
  },
  ERR_DESTINATION_DELETED: {
    errorCode: "ERR_DESTINATION_DELETED",
    message: "This destination has been deleted. Select a new destination.",
  },
  ERR_DESTINATION_REQUIRED: {
    errorCode: "ERR_DESTINATION_REQUIRED",
    message: "Destination required",
  },
  ERR_ANSWER_NOT_SELECTED: {
    errorCode: "ERR_ANSWER_NOT_SELECTED",
    message: "Answer required",
  },
  ERR_DESTINATION_INVALID_WITH_HUB: {
    errorCode: "ERR_DESTINATION_INVALID_WITH_HUB",
    message: "Destination not applicable with hub navigation.",
  },
};

export const SURVEY_ID_ERRORS = {
  ERR_VALID_REQUIRED: "Enter a survey ID",
  ERR_INVALID: "Enter a survey ID in the correct format",
};

export const MISSING_LABEL = "Enter a label";

export const THEME_ERROR_MESSAGES = {
  ERR_NO_THEME_ENABLED:
    "You must turn on at least one theme to preview the questionnaire.",
  ERR_FORM_TYPE_FORMAT: "Enter a form type in the correct format",
};

export const ADDITIONAL_LABEL_MISSING = "Enter a label";
export const buildLabelError = (mainString, insString, pos, pos2) => {
  if (
    typeof pos === "undefined" ||
    typeof pos2 === "undefined" ||
    typeof insString === "undefined" ||
    typeof mainString === "undefined"
  ) {
    return "Label error";
  }
  const newLabelError =
    mainString.slice(0, pos) + insString + mainString.slice(pos2);
  return newLabelError;
};

export const decimalErrors = {
  ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY: {
    errorCode: "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY",
    message: "Enter a decimal that is the same as the associated question page",
  },
};

export const unitPropertyErrors = {
  ERR_VALID_REQUIRED: {
    errorCode: "ERR_VALID_REQUIRED",
    message: "Selection required",
  },
};
