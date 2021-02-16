import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import Badge from "components/Badge";
import VisuallyHidden from "components/VisuallyHidden";

const Wrapper = styled.div`
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
  padding-right: 1em;
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
    <Wrapper className={className} data-test="NavItem">
      <Title
        href={titleUrl}
        active={active}
        bordered={bordered}
        data-test="NavItem-title"
      >
        {Icon && <Icon data-test="NavItem-icon" />}
        {title}
        {errorCount > 0 && (
          <Badge variant="nav" medium data-test="NavItem-error">
            <VisuallyHidden>
              <span>Amount of errors:</span>
            </VisuallyHidden>
            {errorCount}
          </Badge>
        )}
      </Title>
    </Wrapper>
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
