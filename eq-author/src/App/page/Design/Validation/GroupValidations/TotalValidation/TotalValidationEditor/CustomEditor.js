import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { some } from "lodash";

import { Field, Number } from "components/Forms";
import { ERR_TOTAL_NO_VALUE } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const LargerNumber = styled(Number)`
  height: 2.5em;
  width: 10em;
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.red};
    outline-color: ${colors.red};
    box-shadow: 0 0 0 2px ${colors.red};
    border-radius: 4px;
    margin-bottom: 0.5em;
  `}
`;

const hasError = some(validationError.errors, {
  errorCode: ERR_TOTAL_NO_VALUE.errorCode,
});

handleError = () => {
  return <ValidationError right>{ERR_TOTAL_NO_VALUE.message}</ValidationError>;
};

const CustomEditor = ({ total, type, onUpdate, onChange }) => (
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
    {hasError && this.handleError()}
  </>
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
