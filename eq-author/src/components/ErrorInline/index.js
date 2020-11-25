import React from "react";
import PropTypes from "prop-types";
import Icon from "./icon-error.svg?inline";
import styled from "styled-components";
import { colors } from "constants/theme";
import VisuallyHidden from "components/VisuallyHidden";

const Container = styled.div`
  position: absolute;
  right: 0;
  bottom: -2em;
  color: ${colors.red};
  fill: ${colors.red};
  font-weight: normal;
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  line-height: 1.3;
`;

const ErrorInline = ({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <Container data-test="error">
      <IconContainer>
        <Icon />
        <span role="alert">
          <VisuallyHidden>Error:&nbsp;</VisuallyHidden>
          {children}
        </span>
      </IconContainer>
    </Container>
  );
};

ErrorInline.propTypes = {
  children: PropTypes.string,
};

export default ErrorInline;
