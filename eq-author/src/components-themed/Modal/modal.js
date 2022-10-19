import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

const ModalBackground = styled.div`
  /* display: none; */
  position: fixed;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #000000;
  opacity: 0.4;
`;

const ModalContainer = styled.div`
  /* display: none; */
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  position: absolute;
`;

const Modal = ({ isOpen }) => {
  return (
    isOpen && (
      <>
        <ModalBackground />
        <ModalContainer>
          <p>Hello world</p>
        </ModalContainer>
      </>
    )
  );
};

export default Modal;
