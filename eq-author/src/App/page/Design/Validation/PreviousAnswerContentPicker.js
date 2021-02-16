import React, { useMemo } from "react";

import ContentPickerSelect from "components/ContentPickerSelect/index";
import { ANSWER } from "components/ContentPickerSelect/content-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
import { useParams } from "react-router-dom";
import getContentBeforePage from "utils/getContentBeforeEntity";

export const PreviousAnswerContentPicker = (props) => {
  const { questionnaire } = useQuestionnaire();
  const selectedPageParams = useParams();

  const sections = useMemo(
    () =>
      getContentBeforePage({
        questionnaire,
        ...selectedPageParams,
      }),
    [questionnaire, selectedPageParams]
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

export default PreviousAnswerContentPicker;
