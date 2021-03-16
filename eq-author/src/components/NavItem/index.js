import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";

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

const Button = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 0.9em;
  margin: 0;
  color: ${colors.white};
  text-decoration: none;
  padding-right: 1em;
  background-color: transparent;
  border: none;
  cursor: pointer;

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
}) => {
  const history = useHistory();
  return (
    <Button
      className={`${className} NavItem`}
      data-test="NavItem"
      onClick={() => history.push(titleUrl)}
      disabled={disabled}
      bordered={bordered}
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
    </Button>
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
};

export default NavItem;
