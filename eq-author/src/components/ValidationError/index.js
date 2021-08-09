import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import WarningIcon from "assets/icon-error.svg?inline";
import IconText from "components/IconText";
import VisuallyHidden from "components/VisuallyHidden";
import ErrorPanel from "components/Panel/ErrorPanel";

const ErrorStyling = styled(IconText)`
  margin: 0.5em 1em 0.5em 0.1em;
  font-weight: normal;
`;

const ValidationError = ({ variant, children, test }) => (
  <ErrorPanel variant={variant}>
    <ErrorStyling icon={WarningIcon} data-test={test}>
      <VisuallyHidden>Error:&nbsp;</VisuallyHidden>
      {children}
    </ErrorStyling>
  </ErrorPanel>
);

ValidationError.propTypes = {
  children: PropTypes.node,
  test: PropTypes.string,
  variant: PropTypes.string,
};

export default ValidationError;
