import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import chevronRight from "assets/icon-chevron-right-blue.svg";
import chevronDown from "assets/icon-chevron-down-blue.svg";
import { darken } from "polished";

import Button from "components/buttons/Button";
import Badge from "components/Badge";
import VisuallyHidden from "components/VisuallyHidden";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";

// ADD VARIANT OF LIST TO THIS BUT CHECK WHAT THE DIFFERENCE IN THE VARIANTS DO AND WHAT IS NEEDED FOR LIST

const Wrapper = styled.div`
  margin: 0;

  ${({ hasError, isOpen }) =>
    hasError &&
    !isOpen &&
    `
    outline-offset: 2px;
    outline: 2px solid ${colors.errorPrimary};
  `}

  ${({ variant }) =>
    variant === "content" &&
    `
    margin: 0 2em 1em;
    border: 1px solid ${colors.grey};
  `}

  ${({ variant }) =>
    variant === "list" &&
    `
    margin: 0 0em -0.2em;
    border: 1px solid ${colors.bordersLight};
  `}

  ${({ variant }) =>
    variant === "properties" &&
    `
    border: 1px solid ${colors.grey};
  `}
`;

const Header = styled.div`
  margin: 0 0 1em;

  ${({ variant }) =>
    variant === "content" &&
    `
    height: 100%;
    width: 100%;
    background-color: ${colors.primary};
    cursor: pointer;
    margin-bottom: 0;

    &:hover {
      background-color: ${darken(0.1, colors.secondary)};
    }
  `}

  ${({ variant }) =>
    variant === "list" &&
    `
    height: 100%;
    width: 100%;
    background-color: ${colors.primary};
    cursor: pointer;
    margin-bottom: 0;

    &:hover {
      background-color: ${darken(0.1, colors.secondary)};
    }
  `}

  ${({ variant }) =>
    variant === "properties" &&
    `
    cursor: pointer;
    background-color: ${colors.sidebarBlack}
    margin-bottom: 0;
  `};
`;

export const Title = styled.h2`
  vertical-align: middle;
  text-align: left;
  margin: 0;
  padding: 0.25em 0 0.5em;
  font-size: inherit;

  ${Badge} {
    margin-left: 1em;
  }

  ${({ variant }) => variant === "content" && `padding: 0;`}
  ${({ variant }) => variant === "list" && `padding: 0;`}
  ${({ variant }) => variant === "properties" && `padding: 0;`}
`;

export const Body = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-top: -1em;
  border-left: 3px solid ${colors.lightGrey};
  padding: 1em;

  p {
    margin-top: 0;
  }

  ${({ variant }) =>
    (variant === "content" || variant === "list" || variant === "properties") &&
    `
    margin-top: 0;
    border-left: none;
`}

  ${({ variant }) =>
    variant === "properties" &&
    `
`}
`;

export const ToggleCollapsibleButton = styled.button`
  border: none;
  font-size: 1em;
  font-weight: bold;
  margin: 0;
  padding: 0.25em 0.25em 0.25em 0;
  display: flex;
  align-items: center;
  position: relative;
  background: transparent;
  cursor: pointer;
  color: ${colors.blue};
  text-decoration: underline;
  margin-left: 0;

  ${({ variant }) =>
    (variant === "content" || variant === "list" || variant === "properties") &&
    `
    color: ${colors.white};
    text-decoration: none;
    margin-left: 0.5em;
`}

  &:focus {
    outline: 2px solid ${colors.orange};

    ${({ variant }) =>
      (variant === "content" ||
        variant === "list" ||
        variant === "properties") &&
      `outline: none;`}
  }

  &::before {
    content: "";
    background-color: ${colors.blue};
    mask: url(${({ isOpen }) => (isOpen ? chevronDown : chevronRight)});
    width: 1.5em;
    height: 1.5em;
    margin-top: 0.2em;
    margin-left: -0.5em;

    ${({ variant }) =>
      variant === "content" && `background-color: ${colors.white}`}

    ${({ variant }) =>
      variant === "list" && `background-color: ${colors.white}`}

    ${({ variant }) =>
      variant === "properties" && `background-color: ${colors.white}`}
  }

  &:hover {
    color: ${({ variant }) => variant === "default" && `${colors.darkerBlue}`};
  }

  &:hover::before {
    background-color: ${({ variant }) =>
      variant === "default" && `${colors.darkerBlue}`};
  }
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

const ListNamePanel = styled.span`
  display: flex;
  background: ${colors.darkerBlue};
  ${"" /* background: ${colors.red}; */}
  color: ${colors.white};
  align-items: center;
  margin-top: -2.2em;
  margin-right: 65em;
`;

const ListName = styled.span`
  line-height: 1;
  z-index: 1;
  font-family: Lato, sans-serif;
  font-size: 0.9em;
  letter-spacing: 0;
  font-weight: bold;
  padding-left: 1.9em;
  padding-right: 2em;
`;

const Buttons = styled.div`
  display: flex;
  z-index: 2;
  button {
    margin-right: 0.2em;
  }
  button:last-of-type {
    margin-right: 0;
  }
`;

const Collapsible = ({
  showHide = false,
  withoutHideThis = false,
  title,
  defaultOpen,
  className,
  children,
  variant = "default",
  errorCount,
  handleDeleteList,
  displayName,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const renderTitle = (showHide, isOpen, title) => {
    if (showHide && isOpen) {
      return `Hide ${title}`;
    } else if (showHide && !isOpen) {
      return `Show ${title}`;
    }

    return title;
  };

  return (
    <Wrapper
      className={className}
      data-test="collapsible"
      variant={variant}
      hasError={errorCount}
      isOpen={isOpen}
    >
      <Header
        className="collapsible-header"
        data-test="collapsible-header"
        variant={variant}
        onClick={
          variant === "content" ||
          variant === "list" ||
          variant === "properties"
            ? () => setIsOpen((isOpen) => !isOpen)
            : undefined
        }
      >
        <Title
          className="collapsible-title"
          data-test="collapsible-title"
          variant={variant}
        >
          <ToggleCollapsibleButton
            isOpen={isOpen}
            onClick={
              variant === "default"
                ? () => setIsOpen((isOpen) => !isOpen)
                : undefined
            }
            aria-expanded={isOpen}
            aria-controls="collapsible-body"
            data-test="collapsible-toggle-button"
            className="collapsible-toggle-Collapsible-Button"
            variant={variant}
          >
            {renderTitle(showHide, isOpen, title)}
            {errorCount > 0 && !isOpen && (
              <Badge variant="nav" medium data-test="NavItem-error">
                <VisuallyHidden>
                  <span>Amount of errors:</span>
                </VisuallyHidden>
                {errorCount}
              </Badge>
            )}
          </ToggleCollapsibleButton>

          {variant === "list" && (
            <ListNamePanel>
              <ListName data-test="list-name">{displayName}</ListName>
              <Buttons>
                <Tooltip
                  content="Move list up"
                  place="top"
                  offset={{ top: 0, bottom: 10 }}
                >
                  <MoveButton
                    color="white"
                    disabled
                    aria-label={"Move list up"}
                    data-test="btn-move-list-up"
                  >
                    <IconUp />
                  </MoveButton>
                </Tooltip>
                <Tooltip
                  content="Move list down"
                  place="top"
                  offset={{ top: 0, bottom: 10 }}
                >
                  <MoveButton
                    color="white"
                    disabled
                    aria-label={"Move list down"}
                    data-test="btn-move-list-down"
                  >
                    <IconDown />
                  </MoveButton>
                </Tooltip>
                <Tooltip
                  content="Delete list"
                  place="top"
                  offset={{ top: 0, bottom: 10 }}
                >
                  <DeleteButton
                    color="white"
                    size="medium"
                    onClick={handleDeleteList}
                    aria-label="Delete list"
                    data-test="btn-delete-list"
                  />
                </Tooltip>
              </Buttons>
            </ListNamePanel>
          )}
        </Title>
      </Header>
      <Body
        className="collapsible-body"
        data-test="collapsible-body"
        isOpen={isOpen}
        aria-hidden={!isOpen}
        variant={variant}
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

Collapsible.propTypes = {
  /**
   * Text to show on the toggle button.
   */
  title: PropTypes.string.isRequired,
  /**
   * When true, the collapsible is open on every render.
   */
  defaultOpen: PropTypes.bool,
  /**
   * When true, the title is prefixed with 'Show' when the collapsible is closed and 'Hide' when it is open.
   */
  showHide: PropTypes.bool,
  /**
   * If true, the 'Hide this' button is not shown.
   */
  withoutHideThis: PropTypes.bool,
  /**
   * Child components of the collapsible; these will be shown when the collapsible is open.
   */
  children: PropTypes.node.isRequired,
  /**
   * Allows for CSS classes to be filtered down when using Styled-Components.
   */
  className: PropTypes.string,
  /**
   * Value controlling the styling applied to the collapsible.
   */
  variant: PropTypes.oneOf(["default", "content", "properties", "list"]),
  errorCount: PropTypes.number,
  handleDeleteList: PropTypes.func,
  displayName: PropTypes.string,
};

export default Collapsible;
