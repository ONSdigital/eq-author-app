import React from "react";
import PropTypes from "prop-types";

import InlineField from "components/AdditionalContent/InlineField";
import ToggleProperty from "components/AdditionalContent/ToggleProperty";

const Required = ({ answer, label, onChange, getId }) => {
  const id = getId(`${answer.type.toLowerCase()}`, answer.id);

  return (
    <InlineField id={id} label={label}>
      <ToggleProperty
        data-test="answer-properties-required-toggle"
        id={id}
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
  getId: PropTypes.func,
};

Required.defaultProps = {
  label: "Answer required",
};

export default Required;
