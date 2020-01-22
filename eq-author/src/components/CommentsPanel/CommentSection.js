import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styled from "styled-components";
import Button from "components/buttons/Button";
import CommentAccordion from "components/CommentAccordion";

import EditReply from "./EditReply";

import {
  CommentAddSection,
  CommentHeaderContainer,
  AvatarWrapper,
  AvatarOuter,
  AvatarInner,
  NameWrapper,
  FlexLabel,
  DateField,
  EditButton,
  DeleteComment,
  StyledTextArea,
  CommentsDiv,
  DateWrapper,
  CommentFooterContainer,
  SaveButton,
} from "./index";

const ReplyButton = styled(Button)`
  padding: 0.3em 0.8em 0.4em;
  display: ${props => (props.hideReplyBtn ? "none" : "block")};
`;

const StyledAccordion = styled(CommentAccordion)`
  background-color: blue;
`;

const CommentSection = props => {
  const {
    setScroll,
    myId,
    getInitials,
    index,
    item,
    activeCommentId,
    setCommentRef,
    editComment,
    setEditComment,
    displayReplies,
    repliesCount,
    replies,
    setReply,
    setReplyRef,
    reply,
    activeReplyId,
    handleSaveReply,
    handleReply,
    handleSaveEdit,
    handleEdit,
    handleDelete,
  } = props;

  const editCommentName = `edit-comment-${index}`;

  return (
    <CommentAddSection
      ref={tag => {
        setScroll(tag);
      }}
    >
      <CommentHeaderContainer>
        <AvatarWrapper>
          <AvatarOuter avatarColor={item.user.id === myId}>
            <AvatarInner>{getInitials(item.user.name)}</AvatarInner>
          </AvatarOuter>
        </AvatarWrapper>
        <NameWrapper>
          <FlexLabel>{item.user.displayName}</FlexLabel>
          <DateField>{moment(item.createdTime).calendar()}</DateField>
        </NameWrapper>
        <EditButton
          hideEditBtn={item.user.id !== myId}
          onClick={() => handleEdit(item.id, item.commentText)}
          data-test={`btn-edit-comment-${index}`}
        />
        <DeleteComment
          hideDeleteBtn={item.user.id !== myId}
          onClick={() => handleDelete(item)}
          data-test={`btn-delete-comment-${index}`}
        />
      </CommentHeaderContainer>
      {activeCommentId !== item.id ? (
        <CommentsDiv>{item.commentText}</CommentsDiv>
      ) : (
        <StyledTextArea
          id={item.id}
          inputRef={tag => {
            setCommentRef(tag);
          }}
          value={editComment}
          name={editCommentName}
          type="text"
          onChange={({ target }) => setEditComment(target.value)}
          data-test={`edit-comment-txtArea-${index}`}
        />
      )}
      <CommentFooterContainer>
        {item.editedTime && (
          <DateWrapper>
            <DateField>Edited: {moment(item.editedTime).calendar()}</DateField>
          </DateWrapper>
        )}
        {activeReplyId !== item.id && (
          <ReplyButton
            id={`replyBtn-${item.id}`}
            hideReplyBtn={activeCommentId === item.id}
            variant="greyed"
            medium
            onClick={() => handleReply(item.id)}
            data-test={`btn-reply-comment-${index}`}
          >
            reply
          </ReplyButton>
        )}
        {activeCommentId === item.id && (
          <SaveButton
            id={index}
            medium
            onClick={() => handleSaveEdit(item)}
            data-test={`btn-save-editedComment-${index}`}
          >
            Save
          </SaveButton>
        )}
      </CommentFooterContainer>
      {displayReplies.length > 0 && (
        <StyledAccordion title={repliesCount}>{displayReplies}</StyledAccordion>
      )}

      {activeReplyId === item.id && (
        <EditReply
          replies={replies}
          item={item}
          setReplyRef={setReplyRef}
          setReply={setReply}
          reply={reply}
          index={index}
          handleSaveReply={handleSaveReply}
        />
      )}
    </CommentAddSection>
  );
};

CommentSection.propTypes = {
  setScroll: PropTypes.func.isRequired,
  myId: PropTypes.string.isRequired,
  getInitials: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  item: PropTypes.instanceOf(Object).isRequired,
  setReplyRef: PropTypes.func.isRequired,
  activeReplyId: PropTypes.string.isRequired,
  activeCommentId: PropTypes.string.isRequired,
  setCommentRef: PropTypes.func.isRequired,
  editComment: PropTypes.string.isRequired,
  setEditComment: PropTypes.func.isRequired,
  displayReplies: PropTypes.instanceOf(Array).isRequired,
  repliesCount: PropTypes.string.isRequired,
  replies: PropTypes.instanceOf(Array).isRequired,
  setReply: PropTypes.func.isRequired,
  reply: PropTypes.string.isRequired,
  handleSaveReply: PropTypes.func.isRequired,
  handleReply: PropTypes.func.isRequired,
  handleSaveEdit: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CommentSection;
