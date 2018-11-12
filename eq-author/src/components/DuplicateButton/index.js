import React from "react";
import PropTypes from "prop-types";

import IconCopy from "components/EditorToolbar/icon-copy.svg?inline";
import IconText from "components/IconText";
import Button from "components/Button";
import Tooltip from "components/Tooltip";

const DuplicateTooltip = ({ children }) => (
  <Tooltip content="Duplicate" place="top" offset={{ top: 0, bottom: 10 }}>
    {children}
  </Tooltip>
);
DuplicateTooltip.propTypes = {
  children: PropTypes.node.isRequired
};

const DuplicateButton = ({ onClick, children, ...props }) => {
  const Wrapper = children ? React.Fragment : DuplicateTooltip;
  return (
    <Wrapper>
      <Button onClick={onClick} variant="tertiary" small {...props}>
        <IconText icon={IconCopy} hideText={!children}>
          {children || "Duplicate"}
        </IconText>
      </Button>
    </Wrapper>
  );
};

DuplicateButton.defaultProps = {
  hideText: false,
  children: undefined
};

DuplicateButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  hideText: PropTypes.bool
};

export default DuplicateButton;
