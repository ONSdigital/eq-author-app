import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";

import Badge from "components/Badge";
import VisuallyHidden from "components/VisuallyHidden";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 0.9em;
  margin: 0;
  color: ${colors.white};
  font-weight: bold;
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
    color: ${colors.black};

    svg {
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
  history,
}) => {
  return (
    <Wrapper className={className} data-test="NavItem">
      <Title
        onClick={() => history.push(titleUrl)}
        disabled={disabled}
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
  disabled: PropTypes.bool,
  history: CustomPropTypes.history.isRequired,
  bordered: PropTypes.bool,
  errorCount: PropTypes.number,
  icon: PropTypes.element,
  className: PropTypes.string,
};

export default NavItem;
