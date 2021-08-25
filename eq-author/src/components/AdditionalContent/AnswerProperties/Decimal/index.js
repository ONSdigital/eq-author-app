import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { colors } from "constants/theme";

import Number, { NumberInput } from "components/Forms/Number";

const SmallerNumber = styled(Number)`
  width: 7em;
  margin-left: 1em;

  ${NumberInput} {
    ${(props) =>
      props.hasDecimalInconsistency &&
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
    border-radius: 0;
    padding: 0.25em 0.5em;
  }
`;

const Decimal = ({ id, answer, value, onBlur, hasDecimalInconsistency }) => {
  const [decimal, setDecimal] = useState(value);
  useEffect(() => {
    setDecimal(value);
  }, [value]);
  return (
    <>
      <SmallerNumber
        id={id}
        answer={answer}
        name={id}
        onChange={({ value: decimals }) => setDecimal(decimals)}
        onBlur={() => onBlur(decimal)}
        value={decimal}
        hasDecimalInconsistency={hasDecimalInconsistency}
        max={6} //System limit enforced by eq-runner
      />
    </>
  );
};

Decimal.propTypes = {
  id: PropTypes.string.isRequired,
  answer: PropTypes.object, //eslint-disable-line
  value: PropTypes.number.isRequired,
  onBlur: PropTypes.func.isRequired,
  hasDecimalInconsistency: PropTypes.bool.isRequired,
};

export default Decimal;
