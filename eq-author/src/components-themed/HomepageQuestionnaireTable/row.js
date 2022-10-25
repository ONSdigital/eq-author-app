import React, { useState, useRef, useEffect } from "react";
import Tooltip from "components/Forms/Tooltip";

import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import Truncated from "components/Truncated";
import Button from "components/buttons/Button";

import { colors } from "constants/theme";
import { WRITE } from "constants/questionnaire-permissions";
import * as Headings from "constants/table-headings";
import {
  DELETE_QUESTIONNAIRE_TITLE,
  DELETE_QUESTIONNAIRE_WARNING,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content.js";

import FormattedDate from "./FormattedDate.js";
import questionConfirmationIcon from "assets/icon-questionnaire.svg";
import { ReactComponent as StarredIcon } from "assets/icon-starred.svg";
import { ReactComponent as UnstarredIcon } from "assets/icon-unstarred.svg";
import { ReactComponent as LockedIcon } from "assets/icon-locked.svg";
import { ReactComponent as UnlockedIcon } from "assets/icon-unlocked.svg";

import useToggleQuestionnaireStarred from "hooks/useToggleQuestionnaireStarred";
import Modal from "components-themed/Modal";

export const QuestionnaireLink = styled.span`
  color: ${colors.blueLink};
  text-weight: 700;
  display: flex;
  flex-direction: column;
  text-decoration: underline;

  &:focus {
    outline: none;
  }
  &:hover {
    color: ${colors.darkerBlue};
    cursor: pointer;
  }
  ${(props) =>
    props.linkHasFocus &&
    props.questionnaireModal &&
    `
      color: white;
      :nth-of-type(2n-1) {
        color: white;
      }
    `}
`;

export const IconTextButton = styled(Button).attrs({
  small: true,
  variant: "tertiary",
})`
  padding: 0.5em 0.65em;
  margin-left: 0.35em;
  dipslay: flex;
  align-items: center;
  svg {
    display: block;
    margin: auto;
  }
  &:hover svg * {
    transition: 0.1s;
    fill: ${colors.white};
  }
  &:hover {
    --color-bg: ${colors.darkerBlue};
  }
`;

const LockedIconTextButton = styled(IconTextButton)`
  padding: 0.375em 0.55em;
  &:hover {
    --color-bg: ${colors.darkerBlue};
  }
`;

export const DuplicateIconButton = styled(DuplicateButton)`
  &:hover {
    --color-bg: ${colors.darkerBlue};
  }
  &:hover svg * {
    transition: 0.1s;
    fill: ${colors.white};
  }
  svg {
    path {
      fill: ${colors.nightBlue};
    }
  }
`;

export const DeleteButton = styled(IconButtonDelete)`
  &:hover {
    --color-bg: ${colors.darkerBlue};
  }
  &:hover svg * {
    transition: 0.1s;
    fill: ${colors.white};
  }
  svg {
    path {
      fill: ${({ disabledIcon }) =>
        disabledIcon ? colors.grey75 : colors.nightBlue};
    }
    polygon {
      fill: ${({ disabledIcon }) =>
        disabledIcon ? colors.grey75 : colors.nightBlue};
    }
  }
  .lid {
    fill: ${colors.nightBlue};
  }
`;

export const ShortTitle = styled.span`
  color: ${colors.grey80};
  text-decoration-color: ${colors.grey80};
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-right: 1.5em;
`;

export const TR = styled.tr`
  scroll-margin-top: 3em;
  border-top: 1px solid black;
  background-color: ${colors.grey5};
  :nth-of-type(2n-1) {
    background-color: ${colors.white};
  }
  height: 3.2em;
  position: relative;

  &:hover {
    border: 1px solid ${colors.tertiary};
  }

  ${({ linkHasFocus, questionnaireModal }) =>
    linkHasFocus &&
    !questionnaireModal &&
    `
      box-shadow: 0 0 0 3px ${colors.tertiary};
      border-color: ${colors.tertiary};
      z-index: 1;
    `}

  ${({ linkHasFocus, questionnaireModal }) =>
    linkHasFocus &&
    questionnaireModal &&
    `
      border-color: ${colors.primary};
      z-index: 1;
      background-color: ${colors.primary};
      color: white;
      :nth-of-type(2n-1) {
        background-color: ${colors.primary};
        color: white;
      }
      &:hover {
        background-color: ${colors.primary};
      }
    `}

    ${({ selected }) =>
    selected &&
    `background-color: ${colors.primary} !important;
    
      * {
        color: white;
        cursor: default;
      }
    `}
`;

const TD = styled.td`
  line-height: 1.3;
  padding-left: 0.5em;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-of-type {
    padding-left: 1.5em;
    font-weight: bold;
  }
`;

export const DuplicateQuestionnaireButton = styled(DuplicateButton).attrs({
  disableOnClick: false,
})`
  margin-right: 0.5em;
`;

const propTypes = {
  questionnaire: CustomPropTypes.questionnaire.isRequired,
  history: CustomPropTypes.history.isRequired,
  onDeleteQuestionnaire: PropTypes.func,
  onDuplicateQuestionnaire: PropTypes.func,
  onLockQuestionnaire: PropTypes.func,
  exit: PropTypes.bool,
  enter: PropTypes.bool,
  autoFocus: PropTypes.bool,
  isLastOnPage: PropTypes.bool,
  tableHeadings: PropTypes.array, // eslint-disable-line
  onClick: PropTypes.func.isRequired,
  questionnaireModal: PropTypes.bool,
  selected: PropTypes.bool,
};

export const Row = ({
  questionnaire,
  questionnaire: {
    id,
    shortTitle,
    createdBy,
    title,
    createdAt,
    displayName,
    updatedAt,
    starred,
    permission,
    locked,
  },
  selected,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  onLockQuestionnaire,
  autoFocus,
  tableHeadings,
  onClick,
  questionnaireModal,
}) => {
  const [linkHasFocus, setLinkHasFocus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleQuestionnaireStarred = useToggleQuestionnaireStarred();

  const rowRef = useRef();
  const focusLink = () => {
    rowRef.current.getElementsByTagName("span")[0].focus();
  };

  useEffect(() => {
    if (autoFocus) {
      focusLink();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (selected) {
      rowRef.current.scrollIntoView();
    }
  }, [selected]);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const prevAutoFocus = usePrevious(autoFocus);

  useEffect(() => {
    if (!prevAutoFocus && autoFocus) {
      focusLink();
    }
  }, [prevAutoFocus, autoFocus]);

  const handleClick = () => onClick(id);

  const handleFocus = () => {
    setLinkHasFocus(true);
  };

  const handleBlur = () => {
    setLinkHasFocus(false);
  };

  const handleButtonFocus = (e) => {
    setLinkHasFocus(false);
    e.stopPropagation();
  };

  const handleDuplicateQuestionnaire = (e) => {
    e.stopPropagation();
    onDuplicateQuestionnaire(questionnaire);
  };

  const handleDeleteQuestionnaire = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };
  const handleModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleModalConfirm = () => {
    setShowDeleteModal(false);
    onDeleteQuestionnaire(questionnaire);
  };

  const handleStar = (e) => {
    e.stopPropagation();
    toggleQuestionnaireStarred(id);
  };

  const handleLock = (e) => {
    e.stopPropagation();
    onLockQuestionnaire({ id, locked });
  };

  const hasWritePermission = permission === WRITE;
  const canDelete = hasWritePermission && !locked;

  const renderEnabled = (heading) => {
    switch (heading) {
      case Headings.TITLE:
        return (
          <TD key={heading}>
            {shortTitle && (
              <ShortTitle>
                <Truncated>{shortTitle}</Truncated>
              </ShortTitle>
            )}
            <QuestionnaireLink
              data-test="anchor-questionnaire-title"
              tabIndex="0"
              linkHasFocus={linkHasFocus}
              questionnaireModal={questionnaireModal}
              onClick={handleClick}
            >
              <Truncated>{title}</Truncated>
            </QuestionnaireLink>
          </TD>
        );
      case Headings.OWNER:
        return <TD key={heading}>{createdBy.displayName}</TD>;
      case Headings.CREATED:
        return (
          <TD key={heading}>
            <FormattedDate date={createdAt} />
          </TD>
        );
      case Headings.MODIFIED:
        return (
          <TD key={heading}>
            <FormattedDate date={updatedAt} />
          </TD>
        );
      case Headings.LOCKED:
        return (
          <TD key={heading}>
            <Tooltip content={locked ? "Locked" : "Not locked"} place="top">
              <LockedIconTextButton
                title="Lock"
                data-test="lockButton"
                onClick={handleLock}
                disabled={!hasWritePermission}
              >
                {locked ? <LockedIcon /> : <UnlockedIcon />}
              </LockedIconTextButton>
            </Tooltip>
          </TD>
        );
      case Headings.STARRED:
        return (
          <TD key={heading}>
            <Tooltip content={starred ? "Starred" : "Not starred"} place="top">
              <IconTextButton
                title="Star"
                onClick={handleStar}
                data-test="starButton"
              >
                {starred ? <StarredIcon /> : <UnstarredIcon />}
              </IconTextButton>
            </Tooltip>
          </TD>
        );
      case Headings.ACCESS:
        return (
          <TD key={heading} data-test="access">
            {hasWritePermission ? "Editor" : "View Only"}
          </TD>
        );

      case Headings.ACTIONS:
        return (
          <TD key={heading}>
            <div onFocus={handleButtonFocus} data-test="action-btn-group">
              <ButtonGroup>
                <DuplicateIconButton
                  data-test="btn-duplicate-questionnaire"
                  onClick={handleDuplicateQuestionnaire}
                  hideText
                />
                <DeleteButton
                  hideText
                  data-test="btn-delete-questionnaire"
                  onClick={handleDeleteQuestionnaire}
                  disabled={!canDelete}
                  disabledIcon={!canDelete}
                />
              </ButtonGroup>
            </div>
          </TD>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TR
        selected={selected}
        ref={rowRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        linkHasFocus={linkHasFocus}
        questionnaireModal={questionnaireModal}
        data-test="table-row"
      >
        {tableHeadings.map(renderEnabled)}
      </TR>
      <Modal
        title={DELETE_QUESTIONNAIRE_TITLE}
        subtitle={"Test subtitle"}
        warningMessage={DELETE_QUESTIONNAIRE_WARNING}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={handleModalConfirm}
        onClose={handleModalClose}
      />
    </>
  );
};

Row.propTypes = propTypes;

export default withRouter(Row);
