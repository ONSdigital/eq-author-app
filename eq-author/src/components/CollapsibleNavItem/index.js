import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "assets/icon-chevron.svg";

const Wrapper = styled.div`
  ${({ bordered }) => (bordered ? `margin-bottom: 1em` : null)}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 0.9em;
  margin: 0;
  color: ${({ active }) => (active ? colors.black : colors.white)};
  font-weight: bold;
  text-decoration: none;
  background-color: ${({ active }) => (active ? colors.orange : "transparent")};

  ${({ bordered }) => {
    if (bordered) {
      return `
        border-top: 1px solid ${colors.grey}
        border-bottom: 1px solid ${colors.grey}
      `;
    }
  }}

  svg {
    width: 32px;
    height: 32px;
    margin-right: 5px;
    path {
      fill: ${({ active }) => (active ? colors.black : colors.white)};
    }
  }

  &:focus {
    outline: 2px solid ${colors.orange};
  }
`;

const ErrorBadgeNoCount = styled.span`
  margin-top: 0.1em;
  margin-left: auto;
  border-radius: 50%;
  background-color: ${colors.red};
  width: 0.75em;
  height: 0.75em;
  margin-right: 1.3em;

  span {
    display: none;
  }
`;
const ToggleCollapsibleNavItemButton = styled.button`
  appearance: none;
  border: none;
  font-size: 1.2em;
  margin: 0;
  margin-left: 0.1em;
  margin-right: 0.2em;
  padding: 0.3em;
  text-transform: inherit;
  color: ${colors.white};
  letter-spacing: inherit;
  background: transparent;
  cursor: pointer;
  text-align: left;
  &:focus {
    outline: none;
  }
  &::before {
    content: "";
    background: url(${chevron});
    display: block;
    width: 1rem;
    height: 1rem;
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
    transform: rotate(${props => (props.isOpen ? "0deg" : "-90deg")});
  }
  &:focus {
    outline: 2px solid ${colors.orange};
  }
`;

const Body = styled.div`
  display: ${props => (props.isOpen ? "block" : "none")};
  margin-left: 2em;
`;

const CollapsibleNavItem = ({
  icon: Icon,
  title,
  titleUrl,
  open,
  bordered,
  errorCount,
  active,
  className,
  children,
}) => {
  const [isOpen, toggleCollapsible] = useState(open);

  useEffect(() => {
    toggleCollapsible(open);
  }, [open]);

  return (
    <Wrapper
      className={className}
      bordered={bordered}
      data-test="CollapsibleNavItem"
    >
      <Header data-test="CollapsibleNavItem-header">
        <ToggleCollapsibleNavItemButton
          isOpen={isOpen}
          onClick={() => toggleCollapsible(isOpen => !isOpen)}
          aria-expanded={isOpen}
          data-test="CollapsibleNavItem-toggle-button"
        />
        <Title
          href={titleUrl}
          active={active}
          bordered={bordered}
          data-test="CollapsibleNavItem-title"
        >
          {Icon && <Icon data-test="CollapsibleNavItem-icon" />}
          {title}
          {!isOpen && errorCount > 0 ? (
            <ErrorBadgeNoCount data-test="CollapsibleNavItem-error">
              <span>Error</span>
            </ErrorBadgeNoCount>
          ) : null}
        </Title>
      </Header>
      <Body
        data-test={`CollapsibleNavItem-body`}
        isOpen={isOpen}
        aria-hidden={!isOpen}
      >
        {children}
      </Body>
    </Wrapper>
  );
};

CollapsibleNavItem.propTypes = {
  title: PropTypes.string.isRequired,
  titleUrl: PropTypes.string.isRequired,
  active: PropTypes.bool,
  bordered: PropTypes.bool,
  errorCount: PropTypes.number,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.element,
  open: PropTypes.bool,
};

export default CollapsibleNavItem;
