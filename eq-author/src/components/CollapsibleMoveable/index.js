import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import chevron from "assets/icon-chevron.svg";

import Button from "components/buttons/Button";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";

const Wrapper = styled.div`
  margin: 0;
  border: 1px solid ${colors.bordersLight};
  ${({ hasError }) => hasError && `border-color: ${colors.errorPrimary};`}
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
  hasError,
  handleDelete,
  handleMoveUp,
  handleMoveDown,
}) => {
  let startOpenState =
    localStorage.getItem(id) === null
      ? defaultOpen
      : localStorage.getItem(id) === "true";
  const [isOpen, setIsOpen] = useState(startOpenState);
  useEffect(() => {
    localStorage.setItem(id, isOpen);
  }, [id, isOpen]);
  return (
    <Wrapper className={className} hasError={hasError} data-test="collapsible">
      <Header className="collapsible-header" data-test="collapsible-header">
        <ToggleWrapper onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
          <Title>{title}</Title>
          <Tooltip
            content="Move item up"
            place="top"
            offset={{ top: 0, bottom: 10 }}
          >
            <MoveButton
              color="white"
              disabled={handleMoveUp ? "" : true}
              onClick={(event) => {
                event.stopPropagation();
                handleMoveUp(event);
              }}
              aria-label={"Move item up"}
              data-test="btn-move-up"
            >
              <IconUp />
            </MoveButton>
          </Tooltip>
          <Tooltip
            content="Move item down"
            place="top"
            offset={{ top: 0, bottom: 10 }}
          >
            <MoveButton
              color="white"
              disabled={handleMoveDown ? "" : true}
              onClick={(event) => {
                event.stopPropagation();
                handleMoveDown(event);
              }}
              aria-label={"Move item down"}
              data-test="btn-move-down"
            >
              <IconDown />
            </MoveButton>
          </Tooltip>
          <Tooltip
            content="Delete item"
            place="top"
            offset={{ top: 0, bottom: 10 }}
          >
            <DeleteButton
              color="white"
              size="medium"
              disabled={handleDelete ? "" : true}
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(event);
              }}
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
  hasError: false,
};

Collapsible.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  withoutHideThis: PropTypes.bool,
  className: PropTypes.string,
  hasError: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleMoveUp: PropTypes.func,
  handleMoveDown: PropTypes.func,
};

export default Collapsible;
