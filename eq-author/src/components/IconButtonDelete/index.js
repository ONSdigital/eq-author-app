import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import IconDelete from "./icon-delete.svg?inline";
import Button from "components/Button";
import IconText from "components/IconText";
import Tooltip from "components/Tooltip";

const DeleteButton = styled(Button).attrs({
  variant: "tertiary",
  small: true
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

const DeleteTooltip = ({ children }) => (
  <Tooltip content="Delete" place="top" offset={{ top: 0, bottom: 10 }}>
    {children}
  </Tooltip>
);

const IconButtonDelete = ({ hideText, iconText = "Delete", ...otherProps }) => {
  const Wrapper = hideText ? DeleteTooltip : React.Fragment;
  return (
    <Wrapper>
      <DeleteButton title="Delete" {...otherProps}>
        <IconText icon={IconDelete} hideText={hideText}>
          {iconText}
        </IconText>
      </DeleteButton>
    </Wrapper>
  );
};
DeleteTooltip.propTypes = {
  children: PropTypes.node.isRequired
};

IconButtonDelete.propTypes = {
  hideText: PropTypes.bool
};

IconButtonDelete.defaultProps = {
  hideText: false
};

export default IconButtonDelete;
