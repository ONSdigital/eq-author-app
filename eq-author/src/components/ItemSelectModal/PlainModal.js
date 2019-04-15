import styled from "styled-components";
import Modal from "components/modals/Modal";

const PlainModal = styled(Modal).attrs({ hasCloseButton: false })`
  .Overlay {
    background: transparent;
  }

  .Modal {
    width: 23em;
    padding: 0;
  }
`;

export default PlainModal;
