import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import chevronRight from "assets/icon-chevron-right-blue.svg";
import chevronDown from "assets/icon-chevron-down-blue.svg";

import Button from "components/buttons/Button";
import { darken } from "polished";

const Wrapper = styled.div`
  margin: 0 2em 1em;
  border: 1px solid ${colors.grey};
`;

const Header = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${colors.primary};
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, colors.secondary)};
  }
`;

export const Title = styled.h2`
  vertical-align: middle;
  text-align: left;
  margin: 0;
  font-size: inherit;
`;

export const Body = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-left: 0.1em;
  padding: 1em 0 1em 0.5em;
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
  color: ${colors.white};
  margin-left: 0.5em;

  &::before {
    content: "";
    background-color: ${colors.white};
    mask: url(${({ isOpen }) => (isOpen ? chevronDown : chevronRight)});
    width: 1.5em;
    height: 1.5em;
    margin-top: 0.2em;
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

const ContentCollapsible = ({
  showHide = false,
  withHideThis = false,
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
      <Header
        className="collapsible-header"
        data-test="collapsible-header"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <Title className="collapsible-title" data-test="collapsible-title">
          <ToggleCollapsibleButton
            isOpen={isOpen}
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
        {withHideThis && (
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

ContentCollapsible.propTypes = {
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
   * If true, the 'Hide this' button is shown.
   */
  withHideThis: PropTypes.bool,
  /**
   * Child components of the collapsible; these will be shown when the collapsible is open.
   */
  children: PropTypes.node.isRequired,
  /**
   * Allows for CSS classes to be filtered down when using Styled-Components.
   */
  className: PropTypes.string,
};

export default ContentCollapsible;
