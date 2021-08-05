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
  margin-left: 3%;
`;

const calcSumPanel = css`
  margin-left: 3.8%;
`;

const ErrorPanel = ({ variant, children }) => {
  const StyledPanel = styled.div`
    background-color: ${colors.errorSecondary};
    border: 0;
    border-radius: 0;
    border-left: 0.5em solid ${colors.errorPrimary};
    margin: 1em 0;
    display: inline-block;
    width: auto;

    ${variant === "destination" && destinationPanel};
    ${variant === "logic" && logicPanel};
    ${variant === "confirmation" && confirmationPanel};
    ${variant === "calc-sum" && calcSumPanel};
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
