import React, { useMemo } from "react";
import PropTypes from "prop-types";

import ContentPickerSelect from "components/ContentPickerSelect";
import { ANSWER } from "components/ContentPickerSelect/content-types";

import { useCurrentPageId } from "components/RouterContext";
import { useQuestionnaire } from "components/QuestionnaireContext";
import getContentBeforeEntity from "utils/getContentBeforeEntity";

import { ROUTING_ANSWER_TYPES } from "constants/answer-types";

export const preprocessAnswers = (answer) =>
  ROUTING_ANSWER_TYPES.includes(answer.type) ? answer : [];

const RoutingAnswerContentPicker = ({ includeSelf, ...otherProps }) => {
  const { questionnaire } = useQuestionnaire();
  const pageId = useCurrentPageId();

  const previousAnswers = useMemo(
    () =>
      getContentBeforeEntity({
        questionnaire,
        id: pageId,
        includeTargetPage: includeSelf,
        preprocessAnswers,
      }),
    [questionnaire, pageId, includeSelf]
  );

  return (
    <ContentPickerSelect
      name="answerId"
      contentTypes={[ANSWER]}
      answerData={previousAnswers}
      {...otherProps}
    />
  );
};

RoutingAnswerContentPicker.propTypes = {
  includeSelf: PropTypes.bool,
};

export default RoutingAnswerContentPicker;
