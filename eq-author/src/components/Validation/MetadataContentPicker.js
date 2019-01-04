import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import ContentPickerSelect from "components/ContentPickerSelect/index";
import { METADATA } from "components/ContentPickerSelect/content-types";

import AvailableMetadataQuery from "components/Validation/AvailableMetadataQuery";

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

const MetadataContentPicker = props => (
  <AvailableMetadataQuery answerId={props.answerId}>
    {innerProps => (
      <UnwrappedMetadataContentPicker {...innerProps} {...props} />
    )}
  </AvailableMetadataQuery>
);

MetadataContentPicker.propTypes = {
  answerId: PropTypes.string.isRequired
};

export default MetadataContentPicker;
