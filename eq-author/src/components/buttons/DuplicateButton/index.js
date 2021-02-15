import React from "react";
import PropTypes from "prop-types";

import IconCopy from "assets/icon-copy.svg?inline";
import IconText from "components/IconText";
import Button from "components/buttons/Button";

const DuplicateButton = ({ onClick, hideText, children, ...props }) => {
  return (
    <Button onClick={onClick} variant="tertiary" small {...props}>
      <IconText icon={IconCopy} hideText={hideText}>
        {children || "Duplicate"}
      </IconText>
    </Button>
  );
};

DuplicateButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  hideText: PropTypes.bool,
};

export default DuplicateButton;
