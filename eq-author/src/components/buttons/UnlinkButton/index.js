import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { ReactComponent as IconUnlink } from "assets/icon-unlink.svg";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import Tooltip from "components/Forms/Tooltip";
import { colors } from "constants/theme";

const StyledUnlinkButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  .lid {
    transform-origin: 50% 50%;
    transition: all 200ms ease-out;
    fill: ${colors.blue};
  }

  width: 11em;
  height: 2.5em;
  align-items: center;
  margin: 0 0 0 auto;
  font-size: 1rem;

  &:focus,
  &:hover {
    .lid {
      transform: translateY(-1px) rotate(6deg);
      fill: ${colors.white};
    }
  }
`;

const UnlinkTooltip = ({ children }) => (
  <Tooltip content="Unlink dataset" place="top" offset={{ top: 0, bottom: 10 }}>
    {children}
  </Tooltip>
);

const UnlinkButton = ({
  hideText,
  iconText = "Unlink dataset",
  ...otherProps
}) => {
  const Wrapper = hideText ? UnlinkTooltip : React.Fragment;
  const icon = IconUnlink;
  return (
    <Wrapper>
      <StyledUnlinkButton {...otherProps}>
        <IconText icon={icon} hideText={hideText}>
          {iconText}
        </IconText>
      </StyledUnlinkButton>
    </Wrapper>
  );
};
UnlinkTooltip.propTypes = {
  children: PropTypes.node.isRequired,
};

UnlinkButton.propTypes = {
  hideText: PropTypes.bool,
  iconText: PropTypes.string,
  disabledIcon: PropTypes.bool,
};

UnlinkButton.defaultProps = {
  hideText: false,
  iconText: "Unlink dataset",
  disabledIcon: false,
};

export default UnlinkButton;
