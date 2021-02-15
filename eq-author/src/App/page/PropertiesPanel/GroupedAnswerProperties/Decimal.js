import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { colors } from "constants/theme";

import Number, { NumberInput } from "components/Forms/Number";

const SmallerNumber = styled(Number)`
  width: 4em;

  ${NumberInput} {
    ${(props) =>
      props.hasDecimalInconsistency &&
      css`
        border-color: ${colors.red};
        &:focus,
        &:focus-within {
          border-color: ${colors.red};
          outline-color: ${colors.red};
          box-shadow: 0 0 0 2px ${colors.red};
        }
        &:hover {
          border-color: ${colors.red};
          outline-color: ${colors.red};
        }
      `}
    border-radius: 0;
    padding: 0.25em 0.5em;
  }
`;

const Decimal = ({ id, value, onBlur, hasDecimalInconsistency }) => {
  const [decimal, setDecimal] = useState(value);
  return (
    <>
      <SmallerNumber
        id={id}
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
  value: PropTypes.number.isRequired,
  onBlur: PropTypes.func.isRequired,
  hasDecimalInconsistency: PropTypes.bool.isRequired,
};

export default Decimal;
