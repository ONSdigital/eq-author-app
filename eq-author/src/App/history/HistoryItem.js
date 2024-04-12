import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import RichTextEditor from "components/RichTextEditor";
import IconButton from "components/buttons/IconButton";
import Modal from "components-themed/Modal";

import { colors } from "constants/theme";

import { DELETE_NOTE_TITLE, DELETE_BUTTON_TEXT } from "constants/modal-content";

import IconEdit from "./icon-edit.svg?inline";
import IconDelete from "./icon-close.svg?inline";

const EditableItem = styled.div`
  width: 100%;
  margin-bottom: 0.5em;
`;

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2em 0 0;
  border: 1px solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  width: 100%;
  margin: 0;
  justify-content: space-between;
`;

const EditHeader = styled.div`
  background-color: ${(props) =>
    props.active ? colors.blue : colors.darkGrey};
  color: ${colors.white};
`;

const QuestionnaireTitle = styled.div`
  padding: 1em;
  color: ${colors.black};
`;

const QuestionnaireUserName = styled.div`
  padding: 1em;
  color: ${colors.black};
`;

const BreakLine = styled.div`
  flex-basis: 100%;
  height: 0;
`;

const ActionButtons = styled(ButtonGroup)`
  flex: 0 0 auto;
`;

const EventText = styled.div`
  padding: 0 1em 0.5em;
  p {
    margin: 0 0 1em;
    word-break: break-all;
    em {
      background-color: ${colors.highlightGreen};
      font-style: normal;
    }
  }
  h2 {
    em {
      background-color: ${colors.highlightGreen};
      font-style: normal;
    }
  }
  ul {
    margin-top: 0;
    padding-left: 0;
    li {
      list-style: disc;
      margin-left: 1em;
      span {
        font-weight: bold;
      }
      em {
        background-color: ${colors.highlightGreen};
        font-style: normal;
      }
    }
  }
`;

const translations = {
  Published: "Published",
  Unpublished: "Unpublished",
  AwaitingApproval: "Awaiting approval",
  UpdatesRequired: "Updates required",
  "Questionnaire created": "Questionnaire created",
};

const HistoryButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ActionButton = styled(Button)`
  font-size: 0.75em;
  margin-right: 2.55em;
  margin-bottom: 1em;
`;

const formatDate = (date) => moment(date).format("DD/MM/YYYY [at] HH:mm");

const RTEWrapper = styled.div`
  margin: 0 2em 0 1em;
  padding-bottom: 1em;
`;

const HistoryItem = ({
  handleDeleteNote,
  handleUpdateNote,
  questionnaireTitle,
  itemId,
  publishStatus,
  userName,
  currentUser,
  userId,
  bodyText,
  type,
  createdAt,
}) => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [noteState, setNoteState] = useState(bodyText);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEditable =
    (currentUser.id === userId || currentUser.admin) && type === "note";
  const renderBodyText = () => {
    if (!isEditActive && bodyText) {
      return <EventText dangerouslySetInnerHTML={{ __html: bodyText }} />;
    }
    if (isEditActive) {
      return (
        <StyledGrid>
          <RTEWrapper>
            <RichTextEditor
              id={`update-note-textbox`}
              name="note"
              onUpdate={(e) => setNoteState(e.value)}
              label=""
              multiline
              value={noteState}
              controls={{
                heading: true,
                list: true,
                bold: true,
              }}
              autoFocus
            />
          </RTEWrapper>
          <ActionButtons horizontal align="right">
            <ActionButton
              variant="secondary"
              data-test="cancel-note-btn"
              onClick={() => {
                setNoteState(bodyText);
                setIsEditActive(false);
              }}
            >
              Cancel
            </ActionButton>
            <ActionButton
              data-test="save-note-btn"
              onClick={() =>
                handleUpdateNote(itemId, noteState).then(() =>
                  setIsEditActive(false)
                )
              }
            >
              Save
            </ActionButton>
          </ActionButtons>
        </StyledGrid>
      );
    }
  };
  return (
    <EditableItem>
      <Modal
        title={DELETE_NOTE_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() => handleDeleteNote(itemId)}
        onClose={() => setShowDeleteModal(false)}
      />
      {isEditable && (
        <EditHeader active={isEditActive}>
          <HistoryButtonGroup horizontal align="right">
            <IconButton
              icon={IconEdit}
              data-test="edit-note-btn"
              aria-label="Edit"
              onClick={() => setIsEditActive(true)}
            />
            <IconButton
              icon={IconDelete}
              data-test="delete-note-btn"
              aria-label="Delete"
              onClick={() => setShowDeleteModal(true)}
            />
          </HistoryButtonGroup>
        </EditHeader>
      )}
      <StyledItem>
        <QuestionnaireTitle>
          {questionnaireTitle} -{" "}
          <strong>{translations[publishStatus] || publishStatus}</strong>
        </QuestionnaireTitle>
        <QuestionnaireUserName>
          {userName} - {formatDate(createdAt)}
        </QuestionnaireUserName>

        <BreakLine />
        {renderBodyText()}
      </StyledItem>
    </EditableItem>
  );
};

HistoryItem.propTypes = {
  handleDeleteNote: PropTypes.func.isRequired,
  handleUpdateNote: PropTypes.func.isRequired,
  questionnaireTitle: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  publishStatus: PropTypes.string.isRequired,
  bodyText: PropTypes.string,
  type: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  currentUser: CustomPropTypes.user.isRequired,
  userId: PropTypes.string.isRequired,
};

export default HistoryItem;
