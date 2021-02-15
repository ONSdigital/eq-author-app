import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevronRight from "assets/icon-chevron-right-blue.svg";
import chevronDown from "assets/icon-chevron-down-blue.svg";

import Button from "components/buttons/Button";

const Wrapper = styled.div`
  margin-bottom: 1em;
`;

const Header = styled.div`
  padding-left: 0.7em;
  color: ${colors.blue};
  text-decoration: underline;
  &:hover {
    color: ${colors.grey};
  }
`;

export const Title = styled.h2`
  vertical-align: middle;
  text-align: left;
  margin: 0;
  padding: 0.5em 0;
  font-size: inherit;
`;

export const Body = styled.div`
  display: ${props => (props.isOpen ? "block" : "none")};
  margin-top: -1em;
  margin-left: 0.1em;
  padding: 0 0 0 0.5em;
  border-left: 3px solid ${colors.lightGrey};
`;

export const ToggleCollapsibleButton = styled.button`
  border: none;
  font-size: 1em;
  font-weight: bold;
  width: 100%;
  margin: 0;
  padding: 0.5em 0.25em;
  display: flex;
  align-items: center;
  color: ${colors.blue};
  position: relative;
  background: transparent;
  cursor: pointer;

  &:focus {
    outline: 2px solid ${colors.orange};
  }

  &::before {
    content: "";
    background: url(${({ isOpen }) => (isOpen ? chevronDown : chevronRight)});
    display: block;
    position: absolute;
    color: ${colors.blue};
    left: -1.3em;
    top: 0.4em;
    width: 1.5em;
    height: 1.5em;
  }
`;

const HideThisButton = styled(Button)`
  color: black;
  background-color: ${colors.lightGrey};
  font-weight: normal;

  &:hover {
    background-color: ${colors.grey};
  }
`;

const Collapsible = ({ title, defaultOpen, className, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Wrapper className={className} data-test="collapsible">
      <Header data-test="collapsible-header">
        <Title data-test="collapsible-title">
          <ToggleCollapsibleButton
            isOpen={isOpen}
            onClick={() => setIsOpen(isOpen => !isOpen)}
            aria-expanded={isOpen}
            aria-controls="collapsible-body"
            data-test="collapsible-toggle-button"
          >
            {title}
          </ToggleCollapsibleButton>
        </Title>
      </Header>
      <Body data-test="collapsible-body" isOpen={isOpen} aria-hidden={!isOpen}>
        {children}
        <HideThisButton
          medium
          onClick={() => setIsOpen(false)}
          data-test="collapsible-hide-button"
        >
          Hide this
        </HideThisButton>
      </Body>
    </Wrapper>
  );
};

Collapsible.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
};

export default Collapsible;
