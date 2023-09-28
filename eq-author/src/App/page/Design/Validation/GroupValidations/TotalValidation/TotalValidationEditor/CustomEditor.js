import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

import { Field, Number } from "components/Forms";
import { ERR_NO_VALUE } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const LargerNumber = styled(Number)`
  width: 10em;
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    outline-color: ${colors.errorPrimary};
    box-shadow: 0 0 0 2px ${colors.errorPrimary};
    border-radius: 4px;
    margin-bottom: 0;
  `}
`;

const CustomEditor = ({ total, type, onUpdate, onChange, errors }) => (
  <Field>
    <LargerNumber
      hasError={errors?.length}
      value={total.custom}
      name="custom"
      type={type}
      default={null}
      onBlur={onUpdate}
      onChange={onChange}
      max={999999999999999}
      min={-999999999999999}
      id="total-validation-custom"
      data-test="total-validation-number-input"
    />
    {errors?.[0]?.errorCode === "ERR_NO_VALUE" && (
      <ValidationError> {ERR_NO_VALUE} </ValidationError>
    )}
  </Field>
);

CustomEditor.propTypes = {
  total: PropTypes.shape({
    custom: PropTypes.number,
  }).isRequired,
  type: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      errorCode: PropTypes.string,
      field: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string,
    })
  ),
};

export default CustomEditor;
