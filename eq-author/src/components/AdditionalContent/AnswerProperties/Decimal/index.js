import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { filter } from "lodash";
import { colors, radius } from "constants/theme";
import { decimalErrors } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

import Number, { NumberInput } from "components/Forms/Number";

const SmallerNumber = styled(Number)`
  width: 7em;
  margin-left: 0em;

  ${NumberInput} {
    ${(props) =>
      props.hasError &&
      css`
        border-color: ${colors.errorPrimary};
        &:focus,
        &:focus-within {
          border-color: ${colors.errorPrimary};
          outline-color: ${colors.errorPrimary};
          box-shadow: 0 0 0 2px ${colors.errorPrimary};
        }
        &:hover {
          border-color: ${colors.errorPrimary};
          outline-color: ${colors.errorPrimary};
        }
      `}
    border-radius: ${radius};
    padding: 0.25em 0.5em;
  }
`;

const Decimal = ({ id, answer, value, onBlur }) => {
  const [decimal, setDecimal] = useState(value);
  useEffect(() => {
    setDecimal(value);
  }, [value]);
  const errors = filter(answer.validationErrorInfo.errors, {
    field: "decimals",
  });
  return (
    <>
      <SmallerNumber
        id={id}
        answer={answer}
        name={id}
        onChange={({ value: decimals }) => setDecimal(decimals)}
        onBlur={() => onBlur(decimal)}
        value={decimal}
        hasError={errors.length !== 0}
        max={6} //System limit enforced by eq-runner
      />
      {errors.length !== 0 && (
        <ValidationError>
          {decimalErrors[errors[0].errorCode].message}
        </ValidationError>
      )}
    </>
  );
};

Decimal.propTypes = {
  id: PropTypes.string.isRequired,
  answer: PropTypes.object, //eslint-disable-line
  value: PropTypes.number.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Decimal;
