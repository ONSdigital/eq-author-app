import React from "react";
import { ReactComponent as WarningIcon } from "assets/icon-warning-circle.svg";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledWarningIcon = styled(WarningIcon)`
  margin-right: 0.5em;
  margin-top: ${(props) => props.withMarginTop && `-1.1em`};
`;

const Flex = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: ${(props) => props.contentWidth};
`;

/* Show a stylised warning message with black, circular warning icon */
const Warning = ({ contentWidth, withIconMarginTop, children }) => (
  <Flex contentWidth={contentWidth}>
    <StyledWarningIcon withMarginTop={withIconMarginTop} />
    <span>{children}</span>
  </Flex>
);

Warning.propTypes = {
  contentWidth: PropTypes.string,
  withIconMarginTop: PropTypes.bool,
  children: PropTypes.node,
};

export default Warning;
