import React, { useState, useRef, useEffect } from "react";
import Tooltip from "components/Forms/Tooltip";

import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { rgba } from "polished";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import Truncated from "components/Truncated";
import Button from "components/buttons/Button";
import IconText from "components/IconText";

import { colors } from "constants/theme";
import { WRITE } from "constants/questionnaire-permissions";
import * as Headings from "constants/table-headings";

import FormattedDate from "./FormattedDate.js";
import questionConfirmationIcon from "assets/icon-questionnaire.svg";
import { ReactComponent as IconDelete } from "assets/icon-delete.svg";
import { ReactComponent as IconDisabledDelete } from "assets/icon-disabled-delete.svg";
import { ReactComponent as IconCopy } from "assets/icon-copy.svg";
import { ReactComponent as StarredIcon } from "assets/icon-starred.svg";
import { ReactComponent as UnstarredIcon } from "assets/icon-unstarred.svg";
import { ReactComponent as LockedIcon } from "assets/icon-locked.svg";
import { ReactComponent as UnlockedIcon } from "assets/icon-unlocked.svg";

import useToggleQuestionnaireStarred from "hooks/useToggleQuestionnaireStarred";

export const QuestionnaireLink = styled.span`
  color: ${colors.blueLink};
  text-weight: 700;
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  margin-left: -0.5em;
  text-decoration: underline;
  &:focus {
    outline: none;
  }
  &:hover {
    color: ${colors.darkerBlue};
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
`;

const DeleteTooltip = ({ children }) => (
  <Tooltip content="Delete" place="top" offset={{ top: 0, bottom: 10 }}>
    {children}
  </Tooltip>
);

export const ShortTitle = styled.span`
  color: ${colors.grey80};
  text-decoration-color: ${colors.grey80};
  font-size: 0.8em;
  font-weight: bold;
  letter-spacing: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

export const TR = styled.tr`
  scroll-margin-top: 3em;
  border-top: 1px solid black;
  background-color: ${colors.grey6};
  :nth-of-type(2n-1) {
    background-color: rgba(0, 0, 0, 0);
  }
  opacity: 1;
  height: 3.2em;
  position: relative;

  &:hover {
    background-color: ${rgba(colors.primary, 0.1)};
    border: 1px solid #f2c723;
    cursor: pointer;
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
  font-size: 0.9em;
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
              title={displayName}
              tabIndex="0"
              linkHasFocus={linkHasFocus}
              questionnaireModal={questionnaireModal}
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
              <IconTextButton
                title="Lock"
                data-test="lockButton"
                onClick={handleLock}
                disabled={!hasWritePermission}
              >
                {locked ? <LockedIcon /> : <UnlockedIcon />}
              </IconTextButton>
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
          <TD key={heading}>{hasWritePermission ? "Editor" : "View Only"}</TD>
        );

      case Headings.ACTIONS:
        return (
          <TD key={heading}>
            <div onFocus={handleButtonFocus} data-test="action-btn-group">
              <ButtonGroup>
                {/* <IconDisabledDelete /> */}
                <DuplicateQuestionnaireButton
                  data-test="btn-duplicate-questionnaire"
                  onClick={handleDuplicateQuestionnaire}
                  hideText
                />
                <IconButtonDelete
                  hideText
                  data-test="btn-delete-questionnaire"
                  onClick={handleDeleteQuestionnaire}
                  disabledIcon={!canDelete}
                />
                {/* <Tooltip content={"Duplicate"} place="top">
                  <IconTextButton
                    title="Duplicate"
                    onClick={handleDuplicateQuestionnaire}
                    hideText
                    data-test="btn-duplicate-questionnaire"
                  >
                    <IconCopy />
                  </IconTextButton>
                </Tooltip>
                <Tooltip content={"Delete"} place="top">
                  <IconTextButton
                    title="Delete"
                    hideText
                    data-test="btn-delete-questionnaire"
                    onClick={handleDeleteQuestionnaire}
                    disabled={!canDelete}
                  > 
                  {console.log('canDelete :>> ', canDelete)}
                    {canDelete ? <IconDelete />  : <IconDisabledDelete /> }
                  </IconTextButton>
                </Tooltip>  */}
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
        onClick={handleClick}
        questionnaireModal={questionnaireModal}
        data-test="table-row"
      >
        {tableHeadings.map(renderEnabled)}
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
