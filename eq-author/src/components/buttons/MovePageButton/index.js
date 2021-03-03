import React from "react";

import PropTypes from "prop-types";

import Button from "components/buttons/Button";
import IconText from "components/IconText";

import IconMove from "assets/icon-move.svg?inline";

const MovePageButton = ({ onClick, children, ...props }) => (
  <Button
    onClick={onClick}
    data-test="btn-move"
    variant="tertiary"
    small
    {...props}
  >
    <IconText icon={IconMove}>{children || "Move"}</IconText>
  </Button>
);

MovePageButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default MovePageButton;
