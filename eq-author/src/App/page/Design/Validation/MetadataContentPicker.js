import React from "react";
import ContentPickerSelect from "components/ContentPickerSelectv3";
import { METADATA } from "components/ContentPickerSelectv3/content-types";
import { useQuestionnaire } from "components/QuestionnaireContext";

import { DATE } from "constants/metadata-types";

export const MetadataContentPicker = ({ ...otherProps }) => {
  const { questionnaire } = useQuestionnaire();
  const data = {
    [METADATA]:
      questionnaire?.metadata?.filter(({ type }) => type === DATE.value) || [],
  };
  return (
    <ContentPickerSelect
      name="metadata"
      contentTypes={[METADATA]}
      data={data}
      {...otherProps}
    />
  );
};

export default MetadataContentPicker;
