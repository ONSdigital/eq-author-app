import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

const ModalBackground = styled.div`
  /* display: none; */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContainer = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  z-index: 1;
  position: absolute;
`;

const Modal = () => {
  return (
    <>
      <ModalBackground />
      <ModalContainer>
        <p>Hello world</p>
      </ModalContainer>
    </>
  );
};

export default Modal;
