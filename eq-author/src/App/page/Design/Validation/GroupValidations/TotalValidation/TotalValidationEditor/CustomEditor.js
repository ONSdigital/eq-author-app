import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Field, Number } from "components/Forms";

const LargerNumber = styled(Number)`
  height: 2.5em;
  width: 10em;
`;

const CustomEditor = ({ total, type, onUpdate, onChange }) => (
  <Field>
    <LargerNumber
      value={total.custom}
      name="custom"
      type={type}
      onBlur={onUpdate}
      onChange={onChange}
      max={999999999}
      min={-999999999}
      id="total-validation-custom"
      data-test="total-validation-number-input"
    />
  </Field>
);
CustomEditor.propTypes = {
  total: PropTypes.shape({
    custom: PropTypes.number,
  }).isRequired,
  type: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomEditor;
