import React from "react";
import Modal from "components/modals/Modal";
import PropTypes from "prop-types";

const Popover = ({ children, isOpen, onClose, ...otherProps }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    shouldFocusAfterRender={false}
    hasCloseButton={false}
    {...otherProps}
  >
    {children}
  </Modal>
);

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default Popover;
