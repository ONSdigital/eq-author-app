import React from "react";
import PropTypes from "prop-types";
import Icon from "./icon-error.svg?inline";
import styled from "styled-components";
import { colors } from "constants/theme";

import IconText from "components/IconText";
import WarningIcon from "constants/icon-warning.svg?inline";

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

const ErrorStyling = styled(IconText)`
  color: ${colors.red};
  width: ${props => (props.right ? "100%" : "80%")};
  justify-content: flex-end;
  margin: 0.5em 0;
`;

export const ValidationError = props => {
  const { children, right } = props;
  return (
    <ErrorStyling right={right} icon={WarningIcon}>
      {children}
    </ErrorStyling>
  );
};

ValidationError.propTypes = {
  children: PropTypes.node.isRequired,
  right: PropTypes.bool,
};

export default Error;
