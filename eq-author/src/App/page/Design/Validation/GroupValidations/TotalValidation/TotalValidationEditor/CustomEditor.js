import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";

import { colors } from "constants/theme";

import { Field, Number } from "components/Forms";
import { ERR_NO_VALUE } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const LargerNumber = styled(Number)`
  width: 10em;
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.red};
    outline-color: ${colors.red};
    box-shadow: 0 0 0 2px ${colors.red};
    border-radius: 4px;
    margin-bottom: 0;
  `}
`;

const StyledError = styled(ValidationError)`
  width: 60%;
`;

const CustomEditor = props => {
  const { total, type, onUpdate, onChange, errors } = props;

  const hasError = find(errors.errors, error =>
    error.errorCode.includes("ERR_NO_VALUE")
  );

  const handleError = () => {
    return <StyledError>{ERR_NO_VALUE}</StyledError>;
  };
  return (
    <>
      <Field>
        <LargerNumber
          hasError={hasError}
          value={total.custom}
          name="custom"
          type={type}
          default={null}
          onBlur={onUpdate}
          onChange={onChange}
          max={999999999}
          min={-999999999}
          id="total-validation-custom"
          data-test="total-validation-number-input"
        />
      </Field>
      {hasError && handleError()}
    </>
  );
};
CustomEditor.propTypes = {
  total: PropTypes.shape({
    custom: PropTypes.number,
  }).isRequired,
  type: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    id: PropTypes.string,
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        errorCode: PropTypes.string,
        field: PropTypes.string,
        id: PropTypes.string,
        type: PropTypes.string,
      })
    ),
    totalCount: PropTypes.number,
  }),
};

export default CustomEditor;
