import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

const destinationPanel = css`
  margin-left: 41.7%;
`;

const logicPanel = css`
  margin-left: 12.5%;
`;

const confirmationPanel = css`
  margin-left: -1%;
`;

const StyledPanel = styled.div`
  background-color: ${colors.errorSecondary};
  border: 0;
  border-radius: 0;
  border-left: 0.5em solid ${colors.errorPrimary};
  margin: 1em 0;
  display: table;
  width: auto;
  ${(props) => props.variant === "destination" && destinationPanel};
  ${(props) => props.variant === "logic" && logicPanel};
  ${(props) => props.variant === "confirmation" && confirmationPanel};
`;

const ErrorPanel = ({ variant, children }) => (
  <StyledPanel variant={variant}>{children}</StyledPanel>
);

ErrorPanel.propTypes = {
  children: PropTypes.object, //eslint-disable-line
  variant: PropTypes.string,
};

ErrorPanel.defaultProps = {
  variant: "default",
};

export default ErrorPanel;
