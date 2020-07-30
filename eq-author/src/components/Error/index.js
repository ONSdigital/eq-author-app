import React from "react";
import PropTypes from "prop-types";
import Icon from "./icon-error.svg?inline";
import styled from "styled-components";

import { ValidationError } from "./ValidationError";

const Container = styled.div`
  text-align: center;
  padding: 2em 0;
`;

const Message = styled.p`
  font-size: 1.25em;
  font-weight: bold;
`;

const Error = ({ children }) => (
  <Container data-test="error">
    <Icon />
    <Message role="alert">{children}</Message>
  </Container>
);

Error.propTypes = {
  children: PropTypes.string.isRequired,
};

export { ValidationError };

export default Error;
