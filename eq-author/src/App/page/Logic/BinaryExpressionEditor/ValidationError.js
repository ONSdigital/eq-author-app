import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

import IconText from "components/IconText";
import WarningIcon from "constants/icon-warning.svg?inline";

const ErrorStyling = styled(IconText)`
  color: ${colors.red};
  width: ${props => (props.right ? "100%" : "80%")};
  justify-content: flex-end;
  margin: 0.5em 0;
`;

const ValidationError = props => {
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

export default ValidationError;
