import React from "react";
import PropTypes from "prop-types";
import ContentPickerSelect from "components/ContentPickerSelect";
import { METADATA } from "components/ContentPickerSelect/content-types";
import { useQuestionnaire } from "components/QuestionnaireContext";

import { DATE } from "constants/metadata-types";

export const MetadataContentPicker = ({ ...otherProps }) => {
  const { questionnaire } = useQuestionnaire();

  return (
    <ContentPickerSelect
      name="metadata"
      contentTypes={[METADATA]}
      metadataData={
        questionnaire?.metadata?.filter(({ type }) => type === DATE.value) || []
      }
      {...otherProps}
    />
  );
};

MetadataContentPicker.propTypes = {
  data: PropTypes.object, // eslint-disable-line
  path: PropTypes.string.isRequired,
};

export default MetadataContentPicker;
