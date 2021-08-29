import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import InlineField from "components/AnswerContent/AnswerProperties/Format/InlineField";
import ToggleProperty from "components/AnswerContent/ToggleProperty";

const StyledToggleProperty = styled(ToggleProperty)`
  margin: 0;
`;

const Required = ({ answer, label, updateAnswer }) => {
  const onUpdateRequired = ({ value }) => {
    updateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, required: value },
        },
      },
    });
  };
  return (
    <InlineField id={answer.id} label={label}>
      <StyledToggleProperty
        data-test="answer-properties-required-toggle"
        id={answer.id}
        onChange={onUpdateRequired}
        value={answer.properties.required}
      />
    </InlineField>
  );
};

Required.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func.isRequired,
  label: PropTypes.string,
};

Required.defaultProps = {
  label: "Answer required",
};

export default Required;
