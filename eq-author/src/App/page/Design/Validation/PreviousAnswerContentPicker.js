import React, { useMemo } from "react";

import ContentPickerSelect from "components/ContentPickerSelect/index";
import { ANSWER } from "components/ContentPickerSelect/content-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
import { useCurrentPageId } from "components/RouterContext";
import getContentBeforePage from "utils/getContentBeforeEntity";
import PropTypes from "prop-types";

export const PreviousAnswerContentPicker = ({
  preprocessAnswers = (x) => x,
  ...props
}) => {
  const { questionnaire } = useQuestionnaire();
  const id = useCurrentPageId();

  const sections = useMemo(
    () =>
      (questionnaire &&
        id &&
        getContentBeforePage({
          questionnaire,
          id,
          preprocessAnswers,
        })) ||
      [],
    [questionnaire, id]
  );

  return (
    <ContentPickerSelect
      name="previousAnswer"
      contentTypes={[ANSWER]}
      answerData={sections}
      {...props}
    />
  );
};

PreviousAnswerContentPicker.propTypes = {
  preprocessAnswers: PropTypes.func,
};

export default PreviousAnswerContentPicker;
