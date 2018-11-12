import styled from "styled-components";
import Modal from "components/Modal";

const PlainModal = styled(Modal).attrs({ hasCloseButton: false })`
  .Overlay {
    background: transparent;
  }

  .Modal {
    width: 23em;
    padding: 0;
    top: 8em;
  }
`;

export default PlainModal;
