import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import WarningIcon from "assets/icon-error.svg?inline";
import IconText from "components/IconText";
import VisuallyHidden from "components/VisuallyHidden";
import ErrorPanel from "components/Panel/ErrorPanel";

const ErrorStyling = styled(IconText)`
  /* color: ${colors.error};
  width: ${(props) => (props.right ? "100%" : "80%")};
  justify-content: ${(props) =>
    props.right === false ? "flex-start" : "flex-end"}; */
  /* margin: 0.5em 0; */
  margin: 0.5em 1em 0.5em 0.1em;
`;

const ValidationError = ({ children, right, test }) => (
  <ErrorPanel right={right}>
    <ErrorStyling
      icon={WarningIcon}
      // className={className}
      // right={right}
      data-test={test}
    >
      <VisuallyHidden>Error:&nbsp;</VisuallyHidden>
      {children}
    </ErrorStyling>
  </ErrorPanel>
);

ValidationError.propTypes = {
  children: PropTypes.node,
  right: PropTypes.bool,
  // className: PropTypes.string,
  test: PropTypes.string,
};

export default ValidationError;
