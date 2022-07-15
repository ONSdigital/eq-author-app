import React, { useMemo } from "react";

import ContentPickerSelect from "components/ContentPickerSelect/index";
import { ANSWER } from "components/ContentPickerSelect/content-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
import { useCurrentPageId } from "components/RouterContext";
import getContentBeforePage from "utils/getContentBeforeEntity";
import PropTypes from "prop-types";

import allAnswerTypes from "constants/answer-types";

export const PreviousAnswerContentPicker = ({
  allowedAnswerTypes = allAnswerTypes,
  ...props
}) => {
  const { questionnaire } = useQuestionnaire();
  const id = useCurrentPageId();

  const sections = useMemo(
    () =>
      getContentBeforePage({
        questionnaire,
        id,
        preprocessAnswers: (answer) =>
          allowedAnswerTypes.includes(answer.type) ? answer : [],
      }),
    [questionnaire, id, allowedAnswerTypes]
  );

  console.log("sections : ", sections);

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
  allowedAnswerTypes: PropTypes.arrayOf(PropTypes.string),
};

export default PreviousAnswerContentPicker;
