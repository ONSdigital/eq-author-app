import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

const ErrorPanel = ({ children }) => {
  const StyledPanel = styled.div`
    background-color: ${colors.errorSecondary};
    border: 0;
    border-radius: 0;
    border-left: 0.5em solid ${colors.errorPrimary};
    padding: 1em;
    margin: 1em 0;

    p {
      margin: 0;
    }
  `;

  return <StyledPanel>{children}</StyledPanel>;
};

ErrorPanel.propTypes = {
  children: PropTypes.string.isRequired,
};

export default ErrorPanel;
