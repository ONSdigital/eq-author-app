import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/en-gb";
import styled from "styled-components";
import Button from "components/buttons/Button";
import CommentAccordion from "components/CommentAccordion";

import EditReply from "./EditReply";

import {
  CommentAddSection,
  DateField,
  StyledTextArea,
  CommentsDiv,
  DateWrapper,
  CommentFooterContainer,
} from "./index";

import CommentHeader from "./CommentHeader";

// TEST
// const ReplyButton = styled(Button)`
/* display: ${props => (props.isHidden ? "none" : "block")}; */
// `;

const StyledAccordion = styled(CommentAccordion)`
  background-color: blue;
`;

const CommentSection = props => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const {
    myId,
    getInitials,
    index,
    item,
    activeCommentId,
    setCommentRef,
    editComment,
    setEditComment,
    displayReplies,
    replies,
    setReply,
    setReplyRef,
    reply,
    activeReplyId,
    handleSaveReply,
    handleSaveEdit,
    handleEdit,
    handleDelete,
    setActiveReplyId,
    setActiveCommentId,
  } = props;

  const editCommentName = `edit-comment-${index}`;

  const handleClick = id => {
    setAccordionOpen(true);
    setActiveReplyId(id);
  };

  const handleCancel = () => {
    setReply("");
    setActiveCommentId("");
  };

  const canEditComment = activeCommentId === item.id;
  const canEditReply = activeReplyId === item.id;
  const hasReplies = displayReplies.length > 0;

  return (
    <CommentAddSection data-test="comment-add-section">
      <CommentHeader
        myId={myId}
        getInitials={getInitials}
        index={index}
        item={item}
        shared={item}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {/* TEST THIS */}
      {canEditComment ? (
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
      ) : (
        <>
          {/* TEST */}
          <CommentsDiv>{item.commentText}</CommentsDiv>
          {/* END TEST */}
          {item.editedTime && (
            <DateWrapper>
              <DateField>
                Edited: {moment(item.editedTime).calendar()}
              </DateField>
            </DateWrapper>
          )}
        </>
      )}
      <CommentFooterContainer>
        {/* {activeReplyId !== item.id && activeCommentId !== item.id && ( */}
        {!canEditReply && !canEditComment && (
          <Button
            id={`replyBtn-${item.id}`}
            variant="greyed"
            small-medium
            onClick={() => handleClick(item.id)}
            data-test={`btn-reply-comment-${index}`}
          >
            Reply
          </Button>
        )}
        {canEditComment && (
          <>
            <Button
              id={index}
              small-medium
              variant="greyed"
              onClick={() => handleSaveEdit(item)}
              data-test={`btn-save-editedComment-${index}`}
            >
              Save
            </Button>
            <Button
              id={index}
              small-medium
              variant="greyed"
              onClick={() => handleCancel(item)}
              data-test={`btn-cancel-editedComment-${index}`}
            >
              Cancel
            </Button>
          </>
        )}
      </CommentFooterContainer>
      {hasReplies && (
        <StyledAccordion
          title={`${displayReplies.length}`}
          isOpen={accordionOpen}
          setIsOpen={setAccordionOpen}
          inProgress={canEditReply && !accordionOpen}
        >
          {canEditReply && replies.length > 0 && (
            <EditReply
              replyCount={replies.length}
              item={item}
              setReplyRef={setReplyRef}
              setReply={setReply}
              reply={reply}
              index={index}
              handleSaveReply={handleSaveReply}
              setActiveReplyId={setActiveReplyId}
            />
          )}
          {displayReplies}
        </StyledAccordion>
      )}
      {/* END TEST */}
      {/* {activeReplyId === item.id && replies.length === 0 && ( */}
      {canEditReply && replies.length === 0 && (
        <EditReply
          replyCount={replies.length}
          item={item}
          setReplyRef={setReplyRef}
          setReply={setReply}
          reply={reply}
          index={index}
          handleSaveReply={handleSaveReply}
          setActiveReplyId={setActiveReplyId}
        />
      )}
    </CommentAddSection>
  );
};

CommentSection.propTypes = {
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
  replies: PropTypes.instanceOf(Array).isRequired,
  setReply: PropTypes.func.isRequired,
  reply: PropTypes.string.isRequired,
  handleSaveReply: PropTypes.func.isRequired,
  setActiveReplyId: PropTypes.func.isRequired,
  handleSaveEdit: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setActiveCommentId: PropTypes.func.isRequired,
};

export default CommentSection;
