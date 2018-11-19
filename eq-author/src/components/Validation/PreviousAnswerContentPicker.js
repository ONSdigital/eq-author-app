import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import ContentPickerSelect from "components/ContentPickerSelect/index";
import { ANSWER } from "components/ContentPickerSelect/content-types";

import shapeTree from "components/ContentPicker/shapeTree";
import AvailablePreviousAnswersQuery from "components/Validation/AvailablePreviousAnswersQuery";

export const UnwrappedPreviousAnswerContentPicker = ({
  data,
  path,
  ...otherProps
}) => (
  <ContentPickerSelect
    name="previousAnswer"
    contentTypes={[ANSWER]}
    answerData={shapeTree(get(data, path))}
    {...otherProps}
  />
);

UnwrappedPreviousAnswerContentPicker.propTypes = {
  data: PropTypes.object, // eslint-disable-line
  path: PropTypes.string.isRequired
};

export default props => (
  <AvailablePreviousAnswersQuery answerId={props.answerId}>
    {innerProps => (
      <UnwrappedPreviousAnswerContentPicker {...innerProps} {...props} />
    )}
  </AvailablePreviousAnswersQuery>
);
