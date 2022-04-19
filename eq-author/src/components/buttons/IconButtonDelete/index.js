import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { ReactComponent as IconDelete } from "assets/icon-delete.svg";
import { ReactComponent as IconDisabledDelete } from "assets/icon-disabled-delete.svg";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import Tooltip from "components/Forms/Tooltip";
import { colors } from "constants/theme";

const DeleteButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  .lid {
    transform-origin: 50% 50%;
    transition: all 200ms ease-out;
    fill: ${colors.blue};
  }

  &:focus,
  &:hover {
    .lid {
      transform: translateY(-1px) rotate(6deg);
      fill: ${colors.white};
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
  const Wrapper = hideText ? DeleteTooltip : React.Fragment;
  const icon = disabledIcon ? IconDisabledDelete : IconDelete;
  return (
    <Wrapper>
      <DeleteButton {...otherProps}>
        <IconText icon={icon} hideText={hideText}>
          {iconText}
        </IconText>
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
  disabledIcon: PropTypes.bool,
};

IconButtonDelete.defaultProps = {
  hideText: false,
  iconText: "Delete",
  disabledIcon: false,
};

export default IconButtonDelete;
