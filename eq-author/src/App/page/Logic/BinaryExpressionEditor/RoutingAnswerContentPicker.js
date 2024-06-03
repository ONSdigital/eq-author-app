import React, { useMemo } from "react";
import PropTypes from "prop-types";

import ContentPickerSelect from "components/ContentPickerSelectv3";
import {
  ANSWER,
  METADATA,
} from "components/ContentPickerSelectv3/content-types";

import { useCurrentPageId } from "components/RouterContext";
import { useQuestionnaire } from "components/QuestionnaireContext";
import getContentBeforeEntity from "utils/getContentBeforeEntity";

import {
  ROUTING_ANSWER_TYPES,
  ROUTING_METADATA_TYPES,
} from "constants/answer-types";
import { TEXT, TEXT_OPTIONAL } from "constants/metadata-types";

export const preprocessAnswers = (answer) =>
  ROUTING_ANSWER_TYPES.includes(answer.type) ? answer : [];

export const preprocessMetadata = (metadata) =>
  ROUTING_METADATA_TYPES.includes(metadata.type) ? metadata : [];

const RoutingAnswerContentPicker = ({
  includeSelf,
  selectedContentDisplayName,
  expressionGroup,
  selectedId,
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
        expressionGroup,
        selectedId,
      }),
    [questionnaire, pageId, includeSelf, expressionGroup, selectedId]
  );

  const filteredPreviousAnswers = previousAnswers.map((answer) => {
    return {
      ...answer,
      folders: answer.folders.filter((folder) => folder.listId == null),
    };
  });

  const metadata =
    questionnaire?.metadata?.filter(
      ({ type }) => type === TEXT.value || type === TEXT_OPTIONAL.value
    ) || [];

  const data = {
    [ANSWER]: filteredPreviousAnswers,
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
  selectedId: PropTypes.string,
  expressionGroup: PropTypes.object, //eslint-disable-line
};

export default RoutingAnswerContentPicker;
