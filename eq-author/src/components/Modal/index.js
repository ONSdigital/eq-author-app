import React from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";
import DeleteButton from "components/DeleteButton";

export const CloseButton = styled(DeleteButton).attrs({
  "aria-label": "Close",
  size: "medium"
})`
  position: absolute;
  top: 0.25em;
  right: 0.5em;
  padding: 0;
`;

const ReactModalAdapter = ({ className, modalClassName, ...props }) => (
  <ReactModal
    portalClassName={className}
    className={modalClassName}
    {...props}
  />
);

ReactModalAdapter.propTypes = {
  className: ReactModal.propTypes.portalClassName,
  modalClassName: ReactModal.propTypes.className,
  overlayClassName: ReactModal.propTypes.overlayClassName
};

ReactModal.setAppElement("body");

const StyledModal = styled(ReactModalAdapter).attrs({
  overlayClassName: {
    base: "Overlay",
    afterOpen: "Overlay--after-open",
    beforeClose: "Overlay--before-close"
  },
  modalClassName: {
    base: "Modal",
    afterOpen: "Modal--after-open",
    beforeClose: "Modal--before-close"
  }
})`
  .Modal {
    padding: 2em;
    position: absolute;
    background: ${colors.white};
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

    transform: scale(0.8);
    transform-origin: center center;
    transition: all 100ms ease-in 50ms;
    opacity: 0;

    &--after-open {
      transform: scale(1);
      opacity: 1;
    }

    &--before-close {
      transform: scale(0.8);
      opacity: 0;
    }
  }

  .Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 100ms ease-out;
    display: flex;
    justify-content: center;
    z-index: 9999999;
    background-color: rgba(0, 0, 0, 0.5);

    &--after-open {
      opacity: 1;
      align-items: center;
    }

    &--before-close {
      opacity: 0;
    }
  }
`;

class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    hasCloseButton: PropTypes.bool.isRequired
  };

  static defaultProps = {
    hasCloseButton: true
  };

  componentDidMount() {
    document.addEventListener("hashchange", this.props.onClose);
  }

  componentWillUnmount() {
    document.removeEventListener("hashchange", this.props.onClose);
  }

  render() {
    const {
      children,
      isOpen,
      onClose,
      hasCloseButton,
      ...otherProps
    } = this.props;
    return (
      <StyledModal
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick
        closeTimeoutMS={300}
        {...otherProps}
      >
        {hasCloseButton && <CloseButton onClick={onClose}>&times;</CloseButton>}
        {children}
      </StyledModal>
    );
  }
}

export default Modal;
