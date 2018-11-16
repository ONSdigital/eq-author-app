import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Label, Field } from "components/Forms";

import VisuallyHidden from "components/VisuallyHidden";
import ToggleSwitch from "components/ToggleSwitch";

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5em 0 0 -0.4em;
`;

const IncludeLabel = styled(Label)`
  margin-left: 0.5em;
`;

const FieldWithInclude = ({ children, id, name, onChange, ...otherProps }) => (
  <Fragment>
    <VisuallyHidden>
      <Label hidden>Value</Label>
    </VisuallyHidden>
    {children}
    <InlineField>
      <ToggleSwitch id={id} name={name} onChange={onChange} {...otherProps} />
      <IncludeLabel inline htmlFor={id}>
        Include this number
      </IncludeLabel>
    </InlineField>
  </Fragment>
);

FieldWithInclude.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FieldWithInclude;
