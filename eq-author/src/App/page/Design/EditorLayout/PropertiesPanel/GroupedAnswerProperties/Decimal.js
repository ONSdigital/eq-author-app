import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Number, { NumberInput } from "components/Forms/Number";

const SmallerNumber = styled(Number)`
  width: 4em;

  ${NumberInput} {
    border-radius: 0;
    padding: 0.25em 0.5em;
  }
`;

const Decimal = ({ id, value, onChange }) => (
  <SmallerNumber
    id={id}
    name={id}
    onChange={onChange}
    value={value}
    max={6} //System limit enforced by eq-runner
  />
);

Decimal.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Decimal;
