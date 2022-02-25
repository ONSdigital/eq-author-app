import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import IconDelete from "assets/icon-delete.svg?inline";
import IconDisabledDelete from "assets/icon-disabled-delete.svg?inline";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import Tooltip from "components/Forms/Tooltip";

const DeleteButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  .lid {
    transform-origin: 50% 50%;
    transition: all 200ms ease-out;
  }

  &:focus,
  &:hover {
    .lid {
      transform: translateY(-1px) rotate(6deg);
    }
  }
`;

const IconTextColoured = styled(IconText)`
  svg {
    path {
      fill: ${({ disabled }) => (disabled ? "#707070" : "#003e56")};
    }
  }
`;

const DeleteTooltip = ({ children }) => (
  <Tooltip content="Delete" place="top" offset={{ top: 0, bottom: 10 }}>
    {children}
  </Tooltip>
);

const IconButtonDelete = ({
  hideText,
  iconText = "Delete",
  disabledIcon,
  ...otherProps
}) => {
  console.log("...otherProps :>> ", otherProps);
  const Wrapper = hideText ? DeleteTooltip : React.Fragment;
  const icon = disabledIcon ? IconDisabledDelete : IconDelete;
  return (
    <Wrapper>
      <DeleteButton title="Delete" {...otherProps}>
        <IconTextColoured
          icon={icon}
          disabled={disabledIcon}
          hideText={hideText}
        >
          {iconText}
        </IconTextColoured>
      </DeleteButton>
    </Wrapper>
  );
};
DeleteTooltip.propTypes = {
  children: PropTypes.node.isRequired,
};

IconButtonDelete.propTypes = {
  hideText: PropTypes.bool,
  iconText: PropTypes.string,
};

IconButtonDelete.defaultProps = {
  hideText: false,
  iconText: "Delete",
  disabledIcon: false,
};

export default IconButtonDelete;
