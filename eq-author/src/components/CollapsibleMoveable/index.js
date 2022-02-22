import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import chevron from "assets/icon-chevron.svg";

import { darken } from "polished";

import Button from "components/buttons/Button";
import Badge from "components/Badge";
import VisuallyHidden from "components/VisuallyHidden";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";

const Wrapper = styled.div`
  margin: 0;
  border: 1px solid ${colors.bordersLight};
`;

const Header = styled.div`
  margin: 0;
  background-color: ${colors.primary};
`;

const ToggleWrapper = styled.div`
  padding-left: 0.5rem;
  height: 2rem;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  background-color: ${colors.darkerBlue};

  &::before {
    content: "";
    background: url(${chevron});
    display: block;
    width: 1rem;
    height: 1rem;
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
    transform: rotate(${({ isOpen }) => (isOpen ? "0deg" : "-90deg")});
  }
`;

const Title = styled.h2`
  color: ${colors.white};
  margin: 0 0.5rem;
  font-size: inherit;
`;

const Body = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  padding: 1rem;
`;

const HideThisButton = styled(Button)`
  color: black;
  background-color: ${colors.lightGrey};
  font-weight: normal;

  &:hover {
    background-color: ${colors.grey};
  }

  &:focus {
    ${focusStyle}
  }
`;

const Collapsible = ({
  id,
  title,
  withoutHideThis,
  defaultOpen,
  className,
  children,
  errorCount,
  handleDelete,
  handleMoveUp,
  handleMoveDown,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Wrapper className={className} data-test="collapsible">
      <Header className="collapsible-header" data-test="collapsible-header">
        <ToggleWrapper onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
          <Title>{title}</Title>
          <MoveButton
            color="white"
            disabled
            aria-label={"Move item up"}
            data-test="btn-move-up"
          >
            <IconUp />
          </MoveButton>
          <MoveButton
            color="white"
            disabled
            aria-label={"Move item down"}
            data-test="btn-move-down"
          >
            <IconDown />
          </MoveButton>
          <Tooltip
            content="Delete item"
            place="top"
            offset={{ top: 0, bottom: 10 }}
          >
            <DeleteButton
              color="white"
              size="medium"
              onClick={handleDelete}
              aria-label="Delete item"
              data-test="btn-delete-item"
            />
          </Tooltip>
        </ToggleWrapper>
      </Header>
      <Body
        className="collapsible-body"
        data-test="collapsible-body"
        isOpen={isOpen}
        aria-hidden={!isOpen}
      >
        {children}
        {!withoutHideThis && (
          <HideThisButton
            medium
            onClick={() => setIsOpen(false)}
            data-test="collapsible-hide-button"
          >
            Hide this
          </HideThisButton>
        )}
      </Body>
    </Wrapper>
  );
};

Collapsible.defaultProps = {
  defaultOpen: false,
  withoutHideThis: false,
};

Collapsible.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  withoutHideThis: PropTypes.bool,
  className: PropTypes.string,
  errorCount: PropTypes.number,
  handleDelete: PropTypes.func,
  handleMoveUp: PropTypes.func,
  handleMoveDown: PropTypes.func,
};

export default Collapsible;
