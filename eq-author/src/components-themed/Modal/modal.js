import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

const ModalBackground = styled.div`
  position: fixed;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #000000;
  opacity: 0.5;
`;

const ModalContainer = styled.div`
  background-color: #fefefe;
  top: 10.3em;
  left: 33.6em;
  padding: 20px;
  border: 1px solid #888;
  /* height: 20%; */
  width: 25em;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  position: fixed;
`;

const CloseButton = styled.span`
  color: ${({ theme }) => theme.colors.text};
  float: right;
  font-size: 32px;
  cursor: pointer;
`;

const Title = styled.h2``;

const Modal = ({ title, isOpen, onClose }) => {
  return (
    isOpen && (
      <>
        <ModalBackground />
        <ModalContainer>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Title>{title}</Title>
          <p>Test</p>
        </ModalContainer>
      </>
    )
  );
};

export default Modal;
