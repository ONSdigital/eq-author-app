import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

import { gotoTab } from "redux/tabs/actions";

import Modal from "components/Modal";
import { Grid } from "components/Grid";

import Tabs from "./Tabs";

const Dialog = styled(Modal)`
  .Modal {
    width: 60em;
    padding: 0;
  }
`;

export const UnconnectedModalWithNav = ({
  title,
  onClose,
  navItems,
  activeTabId,
  gotoTab,
  isOpen,
  id,
  ...otherProps
}) => (
  <Dialog onClose={onClose} isOpen={isOpen} {...otherProps}>
    <Grid fillHeight>
      <Tabs
        activeTabId={activeTabId}
        onChange={tabId => gotoTab(id, tabId)}
        onClose={onClose}
        navItems={navItems}
        title={title}
      />
    </Grid>
  </Dialog>
);

UnconnectedModalWithNav.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  gotoTab: PropTypes.func.isRequired,
  activeTabId: PropTypes.string,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired
    })
  )
};

UnconnectedModalWithNav.defaultProps = {
  isOpen: false
};

const mapStateToProps = (state, ownProps) => ({
  activeTabId: state.tabs[ownProps.id]
});

export default connect(
  mapStateToProps,
  { gotoTab }
)(UnconnectedModalWithNav);
