import React from "react";
import { connect } from "react-redux";
import { map } from "lodash";
import * as ToastActionCreators from "redux/toast/actions";
import * as UndeleteQuestionnaireActions from "redux/undelete/undeleteQuestionnaire";
import * as UndeleteSectionActions from "redux/undelete/undeleteSection";
import * as UndeleteSectionIntroductionActions from "redux/undelete/undeleteSectionIntroduction";
import * as UndeletePageActions from "redux/undelete/undeletePage";
import * as UndeleteAnswerActions from "redux/undelete/undeleteAnswer";
import Toast from "components/Toast";
import ToastList from "components/Toast/ToastList";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

const mapStateToProps = state => {
  return {
    toasts: state.toasts
  };
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const UndoButton = styled.button`
  background: none;
  border: none;
  color: ${colors.lightBlue};
  margin-left: 2em;
  font-size: inherit;
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

export const ToastArea = ({
  toasts,
  dismissToast,
  undoToast,
  ...otherProps
}) => {
  return (
    <ToastWrapper>
      <ToastOuterContainer>
        <ToastInnerContainer>
          <ToastList>
            {map(toasts, (toast, id) => (
              <Toast key={id} id={id} timeout={5000} onClose={dismissToast}>
                <StyledDiv>
                  {toast.message}
                  {toast.undoAction && (
                    <UndoButton
                      data-test="btn-undo"
                      onClick={() =>
                        undoToast(
                          id,
                          otherProps[toast.undoAction],
                          toast.context
                        )
                      }
                    >
                      Undo
                    </UndoButton>
                  )}
                </StyledDiv>
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
  undoToast: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  Object.assign(
    {},
    UndeleteQuestionnaireActions,
    UndeleteSectionActions,
    UndeleteSectionIntroductionActions,
    UndeletePageActions,
    UndeleteAnswerActions,
    ToastActionCreators
  )
)(ToastArea);
