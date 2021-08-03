import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

const ErrorPanel = ({ variant, children }) => {
  const StyledPanel = styled.div`
    background-color: ${colors.errorSecondary};
    border: 0;
    border-radius: 0;
    border-left: 0.5em solid ${colors.errorPrimary};
    margin: 1em 0;
    display: inline-block;
    width: auto;

    ${variant === "destination" &&
    `
      margin-left: 43.1%;
    `}
    ${variant === "logic" &&
    `
      margin-left: 12.5%;
  `}
    ${variant === "confirm" &&
    `
      margin-left: 3%;
  `}
    ${variant === "calc-sum" &&
    `
      margin-left: 3%;
  `}
  `;

  return <StyledPanel>{children}</StyledPanel>;
};

ErrorPanel.propTypes = {
  children: PropTypes.string.isRequired,
  variant: PropTypes.string,
};

ErrorPanel.defaultProps = {
  variant: "default",
};

export default ErrorPanel;
