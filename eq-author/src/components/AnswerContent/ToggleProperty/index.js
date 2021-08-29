import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const ToggleProperty = ({ id, value, onChange, className }) => (
  <InlineField className={className}>
    <ToggleSwitch
      id={id}
      name={id}
      onChange={onChange}
      hideLabels={false}
      checked={value}
    />
  </InlineField>
);

ToggleProperty.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ToggleProperty;
