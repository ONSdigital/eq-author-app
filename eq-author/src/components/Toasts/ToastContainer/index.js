import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Toast from "./Toast";
import ToastList from "./ToastList";

const StyledDiv = styled.div`
  text-align: center;
`;

const OuterContainer = styled.div`
  position: absolute;
  bottom: 0;
  text-align: center;
  min-width: 10em;
  margin-bottom: ${(props) => (props.hasMargin ? "0.5em" : "0")};
  z-index: 99999999;
`;

const InnerContainer = styled.div`
  display: inline-block;
  text-align: initial;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ToastContainer = ({ toasts, onDismissToast }) => {
  return (
    <Wrapper>
      <OuterContainer>
        <InnerContainer>
          <ToastList>
            {toasts.map(({ id, message }) => (
              <Toast key={id} id={id} timeout={5000} onClose={onDismissToast}>
                <StyledDiv>{message}</StyledDiv>
              </Toast>
            ))}
          </ToastList>
        </InnerContainer>
      </OuterContainer>
    </Wrapper>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDismissToast: PropTypes.func.isRequired,
};

export default ToastContainer;
