import React, { useState, useEffect } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "assets/icon-chevron.svg";

import Badge from "components/Badge";
import VisuallyHidden from "components/VisuallyHidden";
import Truncated from "components/Truncated";

const Wrapper = styled.div`
  margin-bottom: ${({ isBordered }) => (isBordered ? "0.5em" : "0")};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-size: 0.9em;
  margin: 0;
  padding-right: 1em;
  overflow: hidden;
  width: 100%;

  ${({ bordered }) => {
    if (bordered) {
      return `
        border-top: 1px solid ${colors.grey}
        border-bottom: 1px solid ${colors.grey}
      `;
    }
  }}

  ${({ isOpen, bordered }) => {
    if (isOpen && bordered) {
      return `
        margin-bottom: 0.5em;
      `;
    }
  }}

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid ${colors.orange};
  }

  &:disabled {
    background: ${colors.orange};
    outline: none;

    ${Title} {
      color: ${colors.black};
    }

    > svg {
      path {
        fill: ${colors.black};
      }
    }
  }

  svg {
    height: 32px;
    margin-right: 5px;
    path {
      fill: ${colors.white};
    }
    width: 32px;
  }
`;

const Title = styled(Truncated)`
  color: ${colors.white};
  flex: 0 1 75%;
  margin-right: 0.5em;
  text-align: left;
  text-decoration: none;
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
    transform: rotate(${(props) => (props.isOpen ? "0deg" : "-90deg")});
  }

  &:focus {
    outline: 2px solid ${colors.orange};
  }
`;

const Body = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-left: 2em;
`;

const CollapsibleNavItem = ({
  icon: Icon,
  title,
  titleUrl,
  open,
  bordered,
  selfErrorCount = 0,
  childErrorCount = 0,
  disabled,
  className,
  children,
  history,
}) => {
  const [isOpen, toggleCollapsible] = useState(open);

  useEffect(() => {
    toggleCollapsible(open);
  }, [open]);

  return (
    <Wrapper
      className={className}
      data-test="CollapsibleNavItem"
      isBordered={bordered}
    >
      <Header data-test="CollapsibleNavItem-header">
        <ToggleCollapsibleNavItemButton
          isOpen={isOpen}
          onClick={() => toggleCollapsible((isOpen) => !isOpen)}
          aria-expanded={isOpen}
          data-test="CollapsibleNavItem-toggle-button"
        />
        <Button
          onClick={() => history.push(titleUrl)}
          disabled={disabled}
          bordered={bordered}
          isOpen={isOpen}
          data-test="CollapsibleNavItem-title"
        >
          {Icon && <Icon data-test="CollapsibleNavItem-icon" />}
          <Title>{title}</Title>
          {isOpen && selfErrorCount > 0 && (
            <Badge variant="nav" medium data-test="NavItem-error">
              <VisuallyHidden>
                <span>Amount of errors:</span>
              </VisuallyHidden>
              {selfErrorCount}
            </Badge>
          )}
          {!isOpen && childErrorCount + selfErrorCount > 0 ? (
            <Badge variant="nav" small data-test="CollapsibleNavItem-error">
              <VisuallyHidden>
                <span>Error</span>
              </VisuallyHidden>
            </Badge>
          ) : null}
        </Button>
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
  disabled: PropTypes.bool,
  history: CustomPropTypes.history.isRequired,
  bordered: PropTypes.bool,
  childErrorCount: PropTypes.number,
  selfErrorCount: PropTypes.number,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.element,
  open: PropTypes.bool,
};

export default CollapsibleNavItem;
