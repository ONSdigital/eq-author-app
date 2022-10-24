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

const WarningText = styled.span`
  font-weight: ${(props) => props.bold && "bold"};
`;

const Warning = ({ bold, children }) => (
  <Flex>
    <StyledWarningIcon />
    <WarningText bold={bold}>{children}</WarningText>
  </Flex>
);

Warning.propTypes = {
  bold: PropTypes.bool,
  children: PropTypes.node,
};

export default Warning;
