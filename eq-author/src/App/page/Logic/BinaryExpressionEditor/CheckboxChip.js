import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";
import iconClose from "./icon-close.svg";
import VisuallyHidden from "components/VisuallyHidden";
import Truncated from "components/Truncated";

const RemoveButton = styled.button`
  border-radius: 50%;
  border: none;
  background: ${colors.white} url(${iconClose}) no-repeat center;
  background-size: 0.5em;
  font-size: 1rem;
  width: 0.8em;
  height: 0.8em;

  opacity: 0.5;

  &:hover {
    opacity: 1;
  }

  &:focus,
  &:active {
    outline-width: 0;
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }
`;

const Chip = styled.div`
  font-size: 1rem;
  background: ${colors.primary};
  padding: 0.3em 0.3em 0.3em 0.5em;
  border-radius: 4px;
  color: white;
  border: none;
  display: inline-flex;
  align-items: center;
  margin: 0.25rem;
  max-width: 12em;
`;

const Label = styled.span`
  margin-right: 0.2em;
`;

const ChipBox = ({ onRemove, children, id, ...otherProps }) => {
  return (
    <Chip id={id} {...otherProps}>
      <Truncated>
        <Label>{children}</Label>
      </Truncated>

      <RemoveButton onClick={() => onRemove(id)} data-test="remove-chip">
        <VisuallyHidden>Remove</VisuallyHidden>
      </RemoveButton>
    </Chip>
  );
};

ChipBox.propTypes = {
  onRemove: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default ChipBox;
