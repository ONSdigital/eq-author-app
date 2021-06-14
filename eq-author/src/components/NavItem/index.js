import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import styled, { css } from "styled-components";
import { colors, focusStyle } from "constants/theme";

import Badge from "components/Badge";
import VisuallyHidden from "components/VisuallyHidden";
import Truncated from "components/Truncated";

const Title = styled(Truncated)`
  color: ${colors.white};
  flex: 0 1 75%;
  margin-right: 0.5em;
  text-align: left;
  text-decoration: none;
`;

const disabledStyles = css`
  background: ${colors.orange};
  outline: none;
  cursor: default;

  &:hover {
    background: ${colors.orange};
  }

  ${Title} {
    color: ${colors.black};
  }

  > svg {
    path {
      fill: ${colors.black};
    }
  }
`;

const Link = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 0.9em;
  color: ${colors.white};
  text-decoration: none;
  padding-right: 1em;
  border: none;
  cursor: pointer;
  background: none;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  &:focus {
    ${focusStyle}
  }

  &:focus-visible: {
    outline: none;
  }

  &:disabled {
    ${disabledStyles}
  }

  svg {
    width: 32px;
    height: 32px;
    margin-right: 5px;
    path {
      fill: ${colors.white};
    }
  }
`;

const NavItem = ({
  icon: Icon,
  title,
  titleUrl,
  bordered,
  errorCount,
  disabled,
  className,
  ...rest
}) => {
  const history = useHistory();
  return (
    <Link
      className={`${className} NavItem`}
      data-test="NavItem"
      onClick={() => {
        history.push(titleUrl);
      }}
      disabled={disabled}
      bordered={bordered}
      tabIndex={0}
      {...rest}
    >
      {Icon && <Icon data-test="NavItem-icon" />}
      <Title data-test="NavItem-title">{title}</Title>
      {errorCount > 0 && (
        <Badge variant="nav" medium data-test="NavItem-error">
          <VisuallyHidden>
            <span>Amount of errors:</span>
          </VisuallyHidden>
          {errorCount}
        </Badge>
      )}
    </Link>
  );
};

NavItem.propTypes = {
  title: PropTypes.string.isRequired,
  titleUrl: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  bordered: PropTypes.bool,
  errorCount: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  className: PropTypes.string,
  isDragging: PropTypes.bool,
};

export default NavItem;
