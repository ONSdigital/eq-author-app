import React from "react";
import { connect } from "react-redux";
import { map } from "lodash";
import * as ToastActionCreators from "redux/toast/actions";
import Toast from "components/Forms/Toast";
import ToastList from "components/Forms/Toast/ToastList";
import styled from "styled-components";
import PropTypes from "prop-types";

const mapStateToProps = state => {
  return {
    toasts: state.toasts,
  };
};

const StyledDiv = styled.div`
  text-align: center;
`;

const ToastOuterContainer = styled.div`
  position: absolute;
  bottom: 0;
  text-align: center;
  min-width: 10em;
  margin-bottom: ${props => (props.hasMargin ? "0.5em" : "0")};
  z-index: 999;
`;

const ToastInnerContainer = styled.div`
  display: inline-block;
  text-align: initial;
`;

const ToastWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ToastArea = ({ toasts, dismissToast, ...otherProps }) => {
  return (
    <ToastWrapper>
      <ToastOuterContainer>
        <ToastInnerContainer>
          <ToastList>
            {map(toasts, (toast, id) => (
              <Toast key={id} id={id} timeout={5000} onClose={dismissToast}>
                <StyledDiv>{toast.message}</StyledDiv>
              </Toast>
            ))}
          </ToastList>
        </ToastInnerContainer>
      </ToastOuterContainer>
    </ToastWrapper>
  );
};

ToastArea.propTypes = {
  toasts: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dismissToast: PropTypes.func.isRequired,
  undoToast: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  Object.assign({}, ToastActionCreators)
)(ToastArea);
