import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

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
  border-top: ${({ bordered }) =>
    bordered ? `1px solid ${colors.grey}` : "none"};
  border-bottom: ${({ bordered }) =>
    bordered ? `1px solid ${colors.grey}` : "none"};

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

const ErrorBadgeWithCount = styled.span`
  border-radius: 0.7em;
  background-color: ${colors.red};
  color: ${colors.white};
  padding: 0.2em 0.4em;
  font-weight: normal;
  margin-left: auto;
  line-height: 0.8;
  font-size: 1em;
  pointer-events: none;
  height: 1.3em;
  margin-right: 1em;

  span {
    display: none;
  }
`;

const NavItem = ({
  icon: Icon,
  title,
  titleUrl,
  bordered,
  errorCount,
  active,
  className,
}) => {
  return (
    <div className={className} data-test="NavItem">
      <Header data-test="NavItem-header">
        <Title
          href={titleUrl}
          active={active}
          bordered={bordered}
          data-test="NavItem-title"
        >
          {Icon && <Icon data-test="NavItem-icon" />}
          {title}
          {errorCount > 0 && (
            <ErrorBadgeWithCount data-test="NavItem-error">
              <span>Amount of errors:</span>
              {errorCount}
            </ErrorBadgeWithCount>
          )}
        </Title>
      </Header>
    </div>
  );
};

NavItem.propTypes = {
  title: PropTypes.string.isRequired,
  titleUrl: PropTypes.string.isRequired,
  active: PropTypes.bool,
  bordered: PropTypes.bool,
  errorCount: PropTypes.number,
  icon: PropTypes.element,
  className: PropTypes.string,
};

export default NavItem;
