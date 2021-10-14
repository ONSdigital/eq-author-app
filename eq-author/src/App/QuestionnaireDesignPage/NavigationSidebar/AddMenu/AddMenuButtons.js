import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "components/buttons/Button";
import IconText from "components/IconText";
import IconPlus from "assets/icon-plus.svg?inline";

import { radius, colors } from "constants/theme";

const AddMenuButton = styled(Button).attrs({
  variant: "add-content-menu",
  medium: true,
})`
  padding: 0.2em 0.8em;
`;

export const AddButton = styled(Button).attrs({
  variant: "nav-header",
  medium: true,
})`
  width: 100%;
  padding: 0.7em 2.1em;
  z-index: 15;

  &:focus {
    outline: 1px solid ${colors.orange};
  }
`;

const StyledIconText = styled(IconText)`
  justify-content: flex-start;

  svg {
    margin-right: 1em;
    width: 32px;
    height: 32px;

    path {
      fill: ${colors.black};
    }
  }
`;

const StyledIconTextAdd = styled(IconText)`
  justify-content: flex-start;

  svg {
    background-color: ${colors.orange};
    border-radius: ${radius};
    margin-right: 1em;
    flex: inherit;
    width: 22px;
    height: 22px;

    path {
      fill: ${colors.darkGrey};
    }
  }
`;

export const AddContent = "Add / import content";

export const MenuAddButton = (
  <AddButton data-test="btn-add-menu" id="SuperNav-2">
    <StyledIconTextAdd icon={IconPlus}>{AddContent}</StyledIconTextAdd>
  </AddButton>
);

const MenuButtonPropTypes = {
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  dataTest: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export const MenuButton = ({ handleClick, disabled, dataTest, icon, text }) => {
  return (
    <AddMenuButton
      key={dataTest}
      data-test={dataTest}
      disabled={disabled}
      onClick={handleClick}
    >
      <StyledIconText icon={icon}>{text}</StyledIconText>
    </AddMenuButton>
  );
};

MenuButton.propTypes = MenuButtonPropTypes;
