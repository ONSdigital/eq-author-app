import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import chevron from "assets/icon-chevron.svg";

import Badge from "components/Badge";
import VisuallyHidden from "components/VisuallyHidden";
import Truncated from "components/Truncated";

const hoverStyling = `
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled(Truncated)`
  color: ${colors.white};
  flex: 0 1 75%;
  margin-right: 0.5em;
  text-align: left;
  text-decoration: none;
  font-weight: bold;
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

  ${({ bordered, borderColor }) =>
    bordered
      ? `
  border-bottom: 1px solid ${borderColor};
  border-top: 1px solid ${borderColor};
`
      : ""}

  ${hoverStyling}

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

  &:focus {
    outline: 2px solid ${colors.orange};
  }
  ${hoverStyling}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const Body = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-top: ${({ bordered }) => (bordered ? `0.45em` : "")};

  li > * {
    :not(.CollapsibleNavItem) {
      margin-left: 2.6em;
      width: calc(100% - 2.6em);
    }

    &.CollapsibleNavItem {
      li > * {
        :not(.CollapsibleNavItem) {
          margin-left: 4em;
          width: calc(100% - 4em);
        }
      }
    }
  }
`;

const Wrapper = styled.div`
  margin-bottom: ${({ bordered }) => (bordered ? "0.5em" : "0")};
  ${({ isDragging }) => isDragging && focusStyle}
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
  containsActiveEntity,
  isDragging,
}) => {
  const [isOpen, toggleCollapsible] = useState(open);

  const history = useHistory();

  useEffect(() => {
    toggleCollapsible(open);
  }, [open]);

  return (
    <Wrapper
      className={`${className} CollapsibleNavItem`}
      data-test="CollapsibleNavItem"
      bordered={bordered}
      isDragging={isDragging}
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
          borderColor={
            containsActiveEntity && !isOpen ? colors.orange : colors.grey
          }
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
        bordered={bordered}
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
  bordered: PropTypes.bool,
  childErrorCount: PropTypes.number,
  selfErrorCount: PropTypes.number,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.func,
  open: PropTypes.bool,
  containsActiveEntity: PropTypes.bool,
};

export default CollapsibleNavItem;
