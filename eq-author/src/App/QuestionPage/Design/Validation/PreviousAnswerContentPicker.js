import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import ContentPickerSelect from "App/components/ContentPickerSelect/index";
import { ANSWER } from "App/components/ContentPickerSelect/content-types";

import shapeTree from "App/components/ContentPicker/shapeTree";
import AvailablePreviousAnswersQuery from "App/QuestionPage/Design/Validation/AvailablePreviousAnswersQuery";

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
