import React from "react";
import PropType from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";

import ToggleSwitch from "components/buttons/ToggleSwitch";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
  margin-left: 1em;

  > * {
    margin-bottom: 0;
  }
`;

const PropertyLabel = styled(Label)`
  font-weight: normal;
  margin-right: 2em;
`;

const Property = ({ id, children, onChange, checked }) => (
  <InlineField>
    <PropertyLabel inline htmlFor={id}>
      {children}
    </PropertyLabel>
    <ToggleSwitch
      id={id}
      name={id}
      onChange={onChange}
      checked={checked}
      hideLabels={false}
    />
  </InlineField>
);

Property.propTypes = {
  id: PropType.string.isRequired,
  children: PropType.node.isRequired,
  onChange: PropType.func.isRequired,
  checked: PropType.bool,
};

export default Property;
