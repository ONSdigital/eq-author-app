import React, { useRef } from "react";
import PropTypes from "prop-types";

import IconCopy from "assets/icon-copy.svg?inline";
import IconText from "components/IconText";
import Button from "components/buttons/Button";
import Tooltip from "components/Forms/Tooltip";

const ToolTip = ({ children }) => (
  <Tooltip content="Duplicate" place="top" offset={{ top: 0, bottom: 10 }}>
    {children}
  </Tooltip>
);

const Component = ({
  onClick,
  hideText,
  children,
  disableOnClick = true,
  ...props
}) => {
  const btnRef = useRef();

  const handleClick = (event) => {
    if (disableOnClick) {
      event.stopPropagation();
      btnRef.current.disabled = true;
    }
    return onClick(event);
  };

  const renderButton = () => (
    <Button
      onClick={handleClick}
      variant="tertiary"
      small
      {...props}
      ref={btnRef}
    >
      <IconText icon={IconCopy} hideText={hideText}>
        {children || "Duplicate"}
      </IconText>
    </Button>
  );

  return hideText ? <ToolTip>{renderButton()}</ToolTip> : renderButton();
};

ToolTip.propTypes = {
  children: PropTypes.node,
};

Component.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  hideText: PropTypes.bool,
  disableOnClick: PropTypes.bool,
};

export default Component;
