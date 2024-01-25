import React from "react";
import { ReactComponent as WarningIcon } from "assets/icon-warning-circle.svg";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledWarningIcon = styled(WarningIcon)`
  margin-right: 0.5em;
  &.import {
    margin-top: -1.1em;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  &.import {
    width: 40em;
  }
`;

/* Show a stylised warning message with black, circular warning icon */
const Warning = ({ className, children }) => (
  <Flex className={className}>
    <StyledWarningIcon className={className} />
    <span>{children}</span>
  </Flex>
);

Warning.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Warning;
