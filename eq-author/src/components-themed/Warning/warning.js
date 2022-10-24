import React from "react";
import { ReactComponent as WarningIcon } from "assets/icon-warning-round.svg";
import styled from "styled-components";
import PropTypes from "prop-types";

import IconText from "components/IconText";

const WarningPanel = styled(IconText)`
  svg {
    height: 2em;
    width: 2em;
  }
`;

const WarningPanelText = styled.div`
  font-weight: ${(props) => props.bold && "bold"};
  margin-left: 0.5em;
`;

const Warning = ({ bold, children }) => (
  <WarningPanel icon={WarningIcon} left bold withMargin>
    <WarningPanelText bold={bold}>{children}</WarningPanelText>
  </WarningPanel>
);

Warning.propTypes = {
  bold: PropTypes.bool,
  children: PropTypes.node,
};

Warning.defaultProps = {
  bold: true,
};

export default Warning;
