import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import InlineField from "components/AdditionalContent/AnswerProperties/Format/InlineField";
import ToggleProperty from "components/AdditionalContent/ToggleProperty";

const StyledToggleProperty = styled(ToggleProperty)`
  margin: 0;
`;

const Required = ({ answer, label, onChange }) => {
  return (
    <InlineField id={answer.id} label={label}>
      <StyledToggleProperty
        data-test="answer-properties-required-toggle"
        id={answer.id}
        onChange={onChange}
        value={answer.properties.required}
      />
    </InlineField>
  );
};

Required.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

Required.defaultProps = {
  label: "Answer required",
};

export default Required;
