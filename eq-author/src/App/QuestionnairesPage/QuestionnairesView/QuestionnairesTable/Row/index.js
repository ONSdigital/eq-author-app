import React, {useState, useRef, useEffect } from "react";

import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { withRouter, NavLink } from "react-router-dom";
import { rgba } from "polished";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import Truncated from "components/Truncated";

import { buildQuestionnairePath } from "utils/UrlUtils";

import { colors } from "constants/theme";
import { WRITE } from "constants/questionnaire-permissions";

import FormattedDate from "./FormattedDate";
import questionConfirmationIcon from "./icon-questionnaire.svg";

export const QuestionnaireLink = styled(NavLink)`
  text-decoration: none;
  color: ${colors.blue};
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  margin-left: -0.5em;

  &:focus {
    outline: none;
  }
`;

export const ShortTitle = styled.span`
  color: ${colors.textLight};
  text-decoration-color: ${colors.textLight};
  font-size: 0.8em;
  font-weight: bold;
  letter-spacing: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

export const TR = styled.tr`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background-color: rgba(0, 0, 0, 0);
  :nth-of-type(2n-1) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  opacity: 1;
  height: 3.2em;
  position: relative;

  ${props =>
    props.linkHasFocus &&
    css`
      box-shadow: 0 0 0 3px ${colors.tertiary};
      border-color: ${colors.tertiary};
      z-index: 1;
    `}

  &:hover {
    background-color: ${rgba(colors.primary, 0.1)};
    cursor: pointer;
  }
`;

const TD = styled.td`
  line-height: 1.3;
  padding: 0 1em;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DuplicateQuestionnaireButton = styled(DuplicateButton)`
  margin-right: 0.5em;
`;

const Permissions = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
`;

const Permission = styled.li`
  background: ${colors.darkGrey};
  font-weight: bold;
  line-height: 1.2;
  padding: 0.2em 0.7em;
  border-radius: 1em;
  color: white;
  letter-spacing: 0.05em;
  font-size: 0.7em;
  text-transform: initial;
  :not(:last-of-type) {
    margin-right: 0.5em;
  }
  ${props =>
    props.disabled &&
    css`
      background: ${colors.lightGrey};
    `}
`;

const propTypes = {
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  history: CustomPropTypes.history.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
  exit: PropTypes.bool,
  enter: PropTypes.bool,
  autoFocus: PropTypes.bool,
  isLastOnPage: PropTypes.bool,
};

export const Row = ({ questionnaire, questionnaire: {
  id,
  shortTitle,
  createdBy,
  title,
  createdAt,
  displayName,
  updatedAt,
  permission,
}, history, onDeleteQuestionnaire, onDuplicateQuestionnaire, autoFocus, isLastOnPage }) => {

  const [linkHasFocus, setLinkHasFocus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transitionOut, setTransitionOut] = useState(false);

  const rowRef = useRef();
  const focusLink = () => {
    rowRef.current.getElementsByTagName("a")[0].focus();
  }

  useEffect(() => {
    if (autoFocus) {
      focusLink();
    }
  });

  // componentDidUpdate(prevProps) {
  //   if (!prevProps.autoFocus && this.props.autoFocus) {
  //     this.focusLink();
  //   }
  // }

  const handleClick = () => {
    history.push(
      buildQuestionnairePath({
        questionnaireId: questionnaire.id,
      })
    );
  };

  const handleFocus = () => {
    setLinkHasFocus(true);
  };

  const handleBlur = () => {
    setLinkHasFocus(false);
  };

  const handleButtonFocus = e => {
    setLinkHasFocus(false);
    e.stopPropagation();
  };

  const handleLinkClick = e => {
    e.stopPropagation();
  };

  const handleDuplicateQuestionnaire = e => {
    e.stopPropagation();
    onDuplicateQuestionnaire(questionnaire);
  };

  const handleDeleteQuestionnaire = e => {
    e.stopPropagation();
    setShowDeleteModal(true);
    setTransitionOut(isLastOnPage);
  };

  const handleModalClose = () => {
    setShowDeleteModal(false);
    setTransitionOut(false);
  };

  const handleModalConfirm = () => {
    setShowDeleteModal(false);
    onDeleteQuestionnaire(questionnaire);
  };

    const hasWritePermisson = permission === WRITE;

    return (
      <>
        <TR
          ref={rowRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          linkHasFocus={linkHasFocus}
          onClick={handleClick}
          data-test="table-row"
        >
          <TD>
            <QuestionnaireLink
              data-test="anchor-questionnaire-title"
              title={displayName}
              onClick={handleLinkClick}
              to={buildQuestionnairePath({
                questionnaireId: id,
              })}
            >
              {shortTitle && (
                <ShortTitle>
                  <Truncated>{shortTitle}</Truncated>
                </ShortTitle>
              )}
              <Truncated>{title}</Truncated>
            </QuestionnaireLink>
          </TD>
          <TD>
            <FormattedDate date={createdAt} />
          </TD>
          <TD>
            <FormattedDate date={updatedAt} />
          </TD>

          <TD>{createdBy.displayName}</TD>
          <TD>
            <Permissions>
              <Permission>View</Permission>
              <Permission disabled={!hasWritePermisson}>Edit</Permission>
            </Permissions>
          </TD>
          <TD>
            <div onFocus={handleButtonFocus} data-test="action-btn-group">
              <ButtonGroup>
                <DuplicateQuestionnaireButton
                  data-test="btn-duplicate-questionnaire"
                  onClick={handleDuplicateQuestionnaire}
                />
                <IconButtonDelete
                  hideText
                  data-test="btn-delete-questionnaire"
                  onClick={handleDeleteQuestionnaire}
                  disabled={!hasWritePermisson}
                />
              </ButtonGroup>
            </div>
          </TD>
        </TR>

        <DeleteConfirmDialog
          isOpen={showDeleteModal}
          onClose={handleModalClose}
          onDelete={handleModalConfirm}
          title={displayName}
          alertText="This questionnaire including all sections and questions will be deleted."
          icon={questionConfirmationIcon}
          data-test="delete-questionnaire"
        />
      </>
    );
};

Row.propTypes = propTypes;

export default withRouter(Row);