import React from "react";
import PropTypes from "prop-types";

import Icon from "assets/icon-error.svg?inline";
import styled from "styled-components";

import VisuallyHidden from "components/VisuallyHidden";
import ErrorPanel from "components/Panel/ErrorPanel";

const Container = styled.div`
  /* position: ${({ left }) => (left ? "static" : "absolute")}; */
  margin-left: ${({ left }) => (left ? "-0.4rem" : "0")};
  right: 0;
  bottom: -2em;
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
    <ErrorPanel>
      <Container data-test="error" left={left}>
        <IconContainer>
          <Icon />
          <span role="alert">
            <VisuallyHidden>Error:&nbsp;</VisuallyHidden>
            {children}
          </span>
        </IconContainer>
      </Container>
    </ErrorPanel>
  );
};

ErrorInline.propTypes = {
  children: PropTypes.string,
  left: PropTypes.bool,
};

export default ErrorInline;
