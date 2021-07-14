import React from "react";
import { ReactComponent as WarningIcon } from "assets/icon-warning-circle.svg";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledWarningIcon = styled(WarningIcon)`
  margin-right: 0.5em;
`;

const Flex = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

/* Show a stylised warning message with black, circular warning icon */
const Warning = ({ children }) => (
  <Flex>
    <StyledWarningIcon />
    <span>{children}</span>
  </Flex>
);

Warning.propTypes = { children: PropTypes.node };

export default Warning;
