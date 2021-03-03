import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import VisuallyHidden from "../VisuallyHidden/index";

import IconText from "components/IconText";
import WarningIcon from "constants/icon-warning.svg?inline";

const ErrorStyling = styled(IconText)`
  color: ${colors.red};
  width: ${(props) => (props.right ? "100%" : "80%")};
  justify-content: flex-end;
  margin: 0.5em 0;
`;

export const ValidationError = (props) => {
  const { children, right, className } = props;

  return (
    <ErrorStyling className={className} right={right} icon={WarningIcon}>
      <VisuallyHidden>Error:&nbsp;</VisuallyHidden>
      {children}
    </ErrorStyling>
  );
};

ValidationError.propTypes = {
  children: PropTypes.node.isRequired,
  right: PropTypes.bool,
  className: PropTypes.string,
};
