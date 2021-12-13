import {
  richTextEditorErrors,
  questionDefinitionErrors,
} from "constants/validationMessages";

const {
  QUESTION_TITLE_NOT_ENTERED,
  PIPING_TITLE_MOVED,
  PIPING_TITLE_DELETED,
  PIPING_METADATA_DELETED,
  INCLUDE_EXCLUDE_NOT_ENTERED,
  DESCRIPTION_NOT_ENTERED,
  ADDITIONAL_INFO_LABEL_NOT_ENTERED,
  ADDITIONAL_INFO_CONTENT_NOT_ENTERED,
} = richTextEditorErrors;

const { DEFINITION_LABEL_NOT_ENTERED, DEFINITION_CONTENT_NOT_ENTERED } =
  questionDefinitionErrors;

const situations = {
  title: {
    [QUESTION_TITLE_NOT_ENTERED.errorCode]: QUESTION_TITLE_NOT_ENTERED.message,
    [PIPING_TITLE_MOVED.errorCode]: PIPING_TITLE_MOVED.message,
    [PIPING_TITLE_DELETED.errorCode]: PIPING_TITLE_DELETED.message,
    [PIPING_METADATA_DELETED.errorCode]: PIPING_METADATA_DELETED.message,
  },
  definitionLabel: {
    [DEFINITION_LABEL_NOT_ENTERED.errorCode]:
      DEFINITION_LABEL_NOT_ENTERED.message,
  },
  definitionContent: {
    [DEFINITION_CONTENT_NOT_ENTERED.errorCode]:
      DEFINITION_CONTENT_NOT_ENTERED.message,
  },
  guidance: {
    [INCLUDE_EXCLUDE_NOT_ENTERED.errorCode]:
      INCLUDE_EXCLUDE_NOT_ENTERED.message,
  },
  description: {
    [DESCRIPTION_NOT_ENTERED.errorCode]: DESCRIPTION_NOT_ENTERED.message,
    [PIPING_TITLE_MOVED.errorCode]: PIPING_TITLE_MOVED.message,
    [PIPING_TITLE_DELETED.errorCode]: PIPING_TITLE_DELETED.message,
    [PIPING_METADATA_DELETED.errorCode]: PIPING_METADATA_DELETED.message,
  },
  additionalInfoLabel: {
    [ADDITIONAL_INFO_LABEL_NOT_ENTERED.errorCode]:
      ADDITIONAL_INFO_LABEL_NOT_ENTERED.message,
  },
  additionalInfoContent: {
    [ADDITIONAL_INFO_CONTENT_NOT_ENTERED.errorCode]:
      ADDITIONAL_INFO_CONTENT_NOT_ENTERED.message,
  },
};

const getErrorByField = (field, validationErrors) => {
  const error = validationErrors.find((error) => error.field === field);
  return situations[field]?.[error?.errorCode] ?? null;
};

const getMultipleErrorsByField = (field, validationErrors) => {
  const errorArray = validationErrors.filter((error) => error.field === field);
  const errMsgArray = errorArray.map(
    (error) => situations[field]?.[error?.errorCode]
  );

  if (!errMsgArray.length) {
    return null;
  }
  return errMsgArray;
};

export { getErrorByField, getMultipleErrorsByField };
