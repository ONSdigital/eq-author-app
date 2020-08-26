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
  width: 1em;
  height: 1em;
  margin: 0 0.2em;
  opacity: 1;
  margin-right: 0.3em;

  &:hover {
    opacity: 0.5;
    cursor: pointer;
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
  border-radius: 4px;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  margin: 0.25rem 0.5rem 0.25rem 0.25rem;
  max-width: 12em;
`;

const TruncatedLabel = styled(Truncated)`
  padding: 0.3em 0.3em 0.3em 0.5em;
`;

const Line = styled.span`
  border-right: 1px solid ${colors.white};
  padding: 0.3em;
`;

const ChipBox = ({
  onRemove,
  children,
  id,
  isMutuallyExclusive,
  ...otherProps
}) => {
  return (
    <Chip id={id} {...otherProps}>
      {isMutuallyExclusive && (
        <Line data-test="mutually-exclusive-separator">or </Line>
      )}
      <TruncatedLabel>{children}</TruncatedLabel>

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
  isMutuallyExclusive: PropTypes.bool,
};

export default ChipBox;
