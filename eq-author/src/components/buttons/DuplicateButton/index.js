import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import IconCopy from "assets/icon-copy.svg?inline";
import IconText from "components/IconText";
import Button from "components/buttons/Button";
import Tooltip from "components/Forms/Tooltip";

const ToolTip = ({ children }) => (
  <Tooltip content="Duplicate" place="top" offset={{ top: 0, bottom: 10 }}>
    {children}
  </Tooltip>
);
const IconTextColoured = styled(IconText)`
  svg {
    path {
      fill: #003e56;
    }
  }
`;

const DuplicateButton = ({
  onClick,
  hideText,
  children,
  disabled,
  disableOnClick = true,
  ...props
}) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleClick = (event) => {
    if (disableOnClick) {
      setButtonClicked(true);
    }
    return onClick(event);
  };

  const renderButton = () => (
    <Button
      onClick={handleClick}
      variant="tertiary"
      small
      {...props}
      disabled={buttonClicked || disabled}
    >
      <IconTextColoured icon={IconCopy} hideText={hideText}>
        {children || "Duplicate"}
      </IconTextColoured>
    </Button>
  );

  return hideText ? <ToolTip>{renderButton()}</ToolTip> : renderButton();
};

ToolTip.propTypes = {
  children: PropTypes.node,
};

DuplicateButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  hideText: PropTypes.bool,
  disableOnClick: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DuplicateButton;
