import React from "react";
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

const DuplicateButton = ({ onClick, hideText, children, ...props }) => (
  <Button onClick={onClick} variant="tertiary" small {...props}>
    <IconText icon={IconCopy} hideText={hideText}>
      {children || "Duplicate"}
    </IconText>
  </Button>
);

const Component = ({ onClick, hideText, children, ...props }) => {
  if (hideText) {
    return (
      <ToolTip>
        <DuplicateButton onClick={onClick} hideText={hideText} {...props}>
          {children}
        </DuplicateButton>
      </ToolTip>
    );
  }

  return (
    <DuplicateButton onClick={onClick} hideText={hideText} {...props}>
      {children}
    </DuplicateButton>
  );
};

ToolTip.propTypes = {
  children: PropTypes.node,
};

Component.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  hideText: PropTypes.bool,
};

DuplicateButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  hideText: PropTypes.bool,
};

export default Component;
