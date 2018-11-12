import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ScrollPane from "components/ScrollPane";
import { colors, radius } from "constants/theme";

const StyledScrollPane = styled(ScrollPane)`
  padding: 0.25em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PanelWrapper = styled.div`
  padding: 0.6em 0.5em;
  position: relative;
  overflow: auto;
  border: 1px solid ${colors.lightGrey};
  border-radius: 0 0 ${radius} ${radius};
  display: flex;
  flex-grow: 1;
`;

const ContentPickerPanel = ({ id, open, labelledBy, children }) => {
  if (!open) {
    return null;
  }
  return (
    <PanelWrapper
      id={id}
      role="tabpanel"
      aria-hidden={!open}
      aria-labelledby={labelledBy}
    >
      <StyledScrollPane>{children}</StyledScrollPane>
    </PanelWrapper>
  );
};

ContentPickerPanel.propTypes = {
  id: PropTypes.string.isRequired,
  labelledBy: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

export default ContentPickerPanel;
