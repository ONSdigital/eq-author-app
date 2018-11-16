import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Field, Label } from "components/Forms";

const StyledMultiLineField = styled(Field)`
  padding: 0.2em 0;
  margin-bottom: 0.5em;
`;

const MultiLineControl = styled.div`
  margin-top: 0.4em;
`;

const MultiLineField = ({ id, label, children }) => (
  <StyledMultiLineField key={id}>
    <Label bold={false} inline htmlFor={id}>
      {label}
    </Label>
    <MultiLineControl>{children}</MultiLineControl>
  </StyledMultiLineField>
);

MultiLineField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default MultiLineField;
