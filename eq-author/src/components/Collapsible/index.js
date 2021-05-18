import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import chevronRight from "assets/icon-chevron-right-blue.svg";
import chevronDown from "assets/icon-chevron-down-blue.svg";

import Button from "components/buttons/Button";

const Wrapper = styled.ol`
  margin-bottom: 1em;
`;

const Header = styled.div`
  margin-left: -0.5em;
`;

export const Title = styled.h2`
  vertical-align: middle;
  text-align: left;
  margin: 0;
  padding: 0.25em 0 0.5em;
  font-size: inherit;
`;

export const Body = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-top: -1em;
  margin-left: 0.1em;
  padding: 0 0 0 0.5em;
  border-left: 3px solid ${colors.lightGrey};
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
  color: ${colors.blue};
  text-decoration: underline;
  background: transparent;
  cursor: pointer;

  &:focus {
    outline: 2px solid ${colors.orange};
  }

  &::before {
    content: "";
    background-color: ${colors.blue};
    mask: url(${({ isOpen }) => (isOpen ? chevronDown : chevronRight)});
    width: 1.5em;
    height: 1.5em;
    margin-top: 0.2em;
  }

  &:hover {
    color: ${colors.darkerBlue};
  }

  &:hover::before {
    background-color: ${colors.darkerBlue};
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
    <Wrapper className={className} data-test="collapsible">
      <Header className="collapsible-header" data-test="collapsible-header">
        <Title className="collapsible-title" data-test="collapsible-title">
          <ToggleCollapsibleButton
            isOpen={isOpen}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
            aria-expanded={isOpen}
            aria-controls="collapsible-body"
            data-test="collapsible-toggle-button"
            className="collapsible-toggle-Collapsible-Button"
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
};

export default Collapsible;
