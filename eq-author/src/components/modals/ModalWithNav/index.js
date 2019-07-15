import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Modal from "components/modals/Modal";
import { Grid } from "components/Grid";

import Tabs from "./Tabs";

const Dialog = styled(Modal)`
  .Modal {
    width: 60em;
    padding: 0;
  }
`;

const ModalWithNav = ({
  title,
  onClose,
  navItems,
  isOpen,
  startingTabId,
  ...otherProps
}) => {
  const [activeTabId, setActiveTabId] = useState(startingTabId);
  useEffect(() => {
    setActiveTabId(startingTabId);
  }, [startingTabId]);

  return (
    <Dialog onClose={onClose} isOpen={isOpen} {...otherProps}>
      <Grid fillHeight>
        <Tabs
          activeTabId={activeTabId}
          onChange={setActiveTabId}
          onClose={onClose}
          navItems={navItems}
          title={title}
        />
      </Grid>
    </Dialog>
  );
};

ModalWithNav.propTypes = {
  startingTabId: PropTypes.string,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    })
  ),
};

ModalWithNav.defaultProps = {
  isOpen: false,
};

export default ModalWithNav;
