import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import ContentPickerSelect from "App/components/ContentPickerSelect";
import { METADATA } from "App/components/ContentPickerSelect/content-types";

import AvailableMetadataQuery from "App/QuestionPage/Design/Validation/AvailableMetadataQuery";

export const UnwrappedMetadataContentPicker = ({
  data,
  path,
  ...otherProps
}) => (
  <ContentPickerSelect
    name="metadata"
    contentTypes={[METADATA]}
    metadataData={get(data, path)}
    {...otherProps}
  />
);

UnwrappedMetadataContentPicker.propTypes = {
  data: PropTypes.object, // eslint-disable-line
  path: PropTypes.string.isRequired
};

export default props => (
  <AvailableMetadataQuery answerId={props.answerId}>
    {innerProps => (
      <UnwrappedMetadataContentPicker {...innerProps} {...props} />
    )}
  </AvailableMetadataQuery>
);
