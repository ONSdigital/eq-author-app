import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Number } from "components/Forms";

const SmallerNumber = styled(Number)`
  width: 4em;
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
