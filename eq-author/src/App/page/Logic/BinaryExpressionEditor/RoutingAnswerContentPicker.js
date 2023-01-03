import React, { useMemo } from "react";
import PropTypes from "prop-types";

import ContentPickerSelect from "components/ContentPickerSelectv3";
import { ANSWER, METADATA } from "components/ContentPickerSelect/content-types";

import { useCurrentPageId } from "components/RouterContext";
import { useQuestionnaire } from "components/QuestionnaireContext";
import getContentBeforeEntity from "utils/getContentBeforeEntity";

import { ROUTING_ANSWER_TYPES } from "constants/answer-types";
import { TEXT, TEXT_OPTIONAL } from "constants/metadata-types";

export const preprocessAnswers = (answer) =>
  ROUTING_ANSWER_TYPES.includes(answer.type) ? answer : [];

const RoutingAnswerContentPicker = ({
  includeSelf,
  selectedContentDisplayName,
  ...otherProps
}) => {
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

  const metadata =
    questionnaire?.metadata?.filter(
      ({ type }) => type === TEXT.value || type === TEXT_OPTIONAL.value
    ) || [];

  const data = {
    [ANSWER]: previousAnswers,
    [METADATA]: metadata,
  };

  return (
    <ContentPickerSelect
      contentTypes={[ANSWER, METADATA]}
      data={data}
      contentPickerTitle="Select an answer or metadata"
      selectedContentDisplayName={
        selectedContentDisplayName || "Select an answer or metadata"
      }
      {...otherProps}
    />
  );
};

RoutingAnswerContentPicker.propTypes = {
  includeSelf: PropTypes.bool,
  selectedContentDisplayName: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default RoutingAnswerContentPicker;
