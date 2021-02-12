import React, { useMemo } from "react";

import ContentPickerSelect from "components/ContentPickerSelect/index";
import { ANSWER } from "components/ContentPickerSelect/content-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
import { useCurrentPageId } from "components/RouterContext";
import getContentBeforePage from "utils/getContentBeforePage";

export const PreviousAnswerContentPicker = (props) => {
  const { questionnaire } = useQuestionnaire();
  const pageId = useCurrentPageId();

  const sections = useMemo(
    () =>
      getContentBeforePage({
        questionnaire,
        pageId,
      }),
    [questionnaire, pageId]
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

const UnwrappedPreviousAnswerContentPicker = PreviousAnswerContentPicker;

export default PreviousAnswerContentPicker;
export { UnwrappedPreviousAnswerContentPicker };
