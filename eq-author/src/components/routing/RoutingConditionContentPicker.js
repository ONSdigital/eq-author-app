import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import ContentPickerSelect from "components/ContentPickerSelect/index";
import { QUESTION } from "components/ContentPickerSelect/content-types";
import { shapePageTree } from "components/ContentPicker/shapeTree";

import AvailableRoutingQuestionsQuery from "components/routing/AvailableRoutingQuestionsQuery";

export const UnwrappedRoutingConditionContentPicker = ({
  data,
  path,
  ...otherProps
}) => (
  <ContentPickerSelect
    name="questionPageId"
    contentTypes={[QUESTION]}
    questionData={shapePageTree(get(data, path))}
    {...otherProps}
  />
);

UnwrappedRoutingConditionContentPicker.propTypes = {
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  path: PropTypes.string.isRequired
};

export default props => (
  <AvailableRoutingQuestionsQuery pageId={props.pageId}>
    {innerProps => (
      <UnwrappedRoutingConditionContentPicker {...innerProps} {...props} />
    )}
  </AvailableRoutingQuestionsQuery>
);
