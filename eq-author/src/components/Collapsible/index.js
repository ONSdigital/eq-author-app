import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import chevronRight from "assets/icon-chevron-right-blue.svg";
import chevronDown from "assets/icon-chevron-down-blue.svg";
import { darken } from "polished";

import Button from "components/buttons/Button";

const Wrapper = styled.div`
  margin: ${(props) =>
    props.variant === "default" ? `0 2.5em 1em` : `0 2em 1em`};
  border: ${(props) =>
    props.variant === "content" && ` 1px solid ${colors.grey}`};
`;

const Header = styled.div`
  margin-left: -0.5em;

  ${(props) =>
    props.variant === "content" &&
    `
    margin-left: 0;
    height: 100%;
    width: 100%;
    background-color: ${colors.primary};
    cursor: pointer;

    &:hover {
      background-color: ${darken(0.1, colors.secondary)};
    }
`}
`;

export const Title = styled.h2`
  vertical-align: middle;
  text-align: left;
  margin: 0;
  padding: 0.25em 0 0.5em;
  font-size: inherit;

  ${(props) => props.variant === "content" && `padding: 0;`}
`;

export const Body = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-top: -1em;
  margin-left: 0.1em;
  padding-left: 0.5em;
  border-left: 3px solid ${colors.lightGrey};

  ${(props) =>
    props.variant === "content" &&
    `
    margin-top: 0;
    margin-left: 0;
    padding: 1em 0 1em 0.5em;
    border-left: none;
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
  text-decoration: ${(props) => props.variant === "default" && `underline`};
  background: transparent;
  cursor: pointer;
  margin-left: ${(props) => props.variant === "content" && `0.5em`};
  color: ${colors.blue};
  text-decoration: underline;
  margin-left: 0;

  ${(props) =>
    props.variant === "content" &&
    `
    color: ${colors.white};
    text-decoration: none;
    margin-left: 0.5em;
`}

  &:focus {
    outline: 2px solid ${colors.orange};

    ${(props) => props.variant === "content" && `outline: none;`}
  }

  &::before {
    content: "";
    background-color: ${colors.blue};
    mask: url(${({ isOpen }) => (isOpen ? chevronDown : chevronRight)});
    width: 1.5em;
    height: 1.5em;
    margin-top: 0.2em;

    ${(props) =>
      props.variant === "content" && `background-color: ${colors.white}`}
  }

  &:hover {
    color: ${(props) => props.variant === "default" && `${colors.darkerBlue}`};
  }

  &:hover::before {
    background-color: ${(props) =>
      props.variant === "default" && `${colors.darkerBlue}`};
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

const Collapsible = ({
  showHide = false,
  withoutHideThis = false,
  title,
  defaultOpen,
  className,
  children,
  variant = "default",
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
    <Wrapper className={className} data-test="collapsible" variant={variant}>
      <Header
        className="collapsible-header"
        data-test="collapsible-header"
        variant={variant}
        onClick={
          variant === "content" && (() => setIsOpen((isOpen) => !isOpen))
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
              variant === "default" && (() => setIsOpen((isOpen) => !isOpen))
            }
            aria-expanded={isOpen}
            aria-controls="collapsible-body"
            data-test="collapsible-toggle-button"
            className="collapsible-toggle-Collapsible-Button"
            variant={variant}
          >
            {renderTitle(showHide, isOpen, title)}
          </ToggleCollapsibleButton>
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
  variant: PropTypes.oneOf(["default", "content"]),
};

export default Collapsible;
