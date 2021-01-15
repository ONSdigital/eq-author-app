import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import IconText from "components/IconText";
import WarningIcon from "constants/icon-warning.svg?inline";
import VisuallyHidden from "../VisuallyHidden/index";

const ErrorStyling = styled(IconText)`
  color: ${colors.red};
  width: ${props => (props.right ? "100%" : "80%")};
  justify-content: ${props =>
    props.right === false ? "flex-start" : "flex-end"};
  margin: 0.5em 0;
`;

const ValidationError = ({ children, right, className, test }) => (
  <ErrorStyling
    icon={WarningIcon}
    className={className}
    right={right}
    data-test={test}
  >
    <VisuallyHidden>Error:&nbsp;</VisuallyHidden>
    {children}
  </ErrorStyling>
);

ValidationError.propTypes = {
  children: PropTypes.node.isRequired,
  right: PropTypes.bool,
  className: PropTypes.string,
  test: PropTypes.string,
};

export default ValidationError;
