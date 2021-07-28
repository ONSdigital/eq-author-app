import React from "react";
import PropTypes from "prop-types";
import Icon from "./icon-error.svg?inline";
import styled from "styled-components";
import { colors } from "constants/theme";
import VisuallyHidden from "components/VisuallyHidden";

const Container = styled.div`
  position: ${({ left }) => (left ? "static" : "absolute")};
  margin-left: ${({ left }) => (left ? "-0.4rem" : "0")};
  right: 0;
  bottom: -2em;
  color: ${colors.orange};
  fill: ${colors.orange};
  font-weight: normal;
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  line-height: 1.3;
`;

const ErrorInline = ({ children, left }) => {
  if (!children) {
    return null;
  }

  return (
    <Container data-test="error" left={left}>
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
  left: PropTypes.bool,
};

export default ErrorInline;
