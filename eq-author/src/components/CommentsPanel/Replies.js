import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/en-gb";
import {
  Reply,
  DateField,
  StyledTextArea,
  CommentsDiv,
  DateWrapper,
  CommentFooterContainer,
} from "./index";

import CommentHeader from "./CommentHeader";

import Button from "components/buttons/Button";

const Replies = props => {
  const {
    repliesItem,
    myId,
    getInitials,
    handleEditReply,
    index,
    repliesIndex,
    handleDeleteReply,
    item,
    activeReplyId,
    setReplyRef,
    setEditReply,
    editReply,
    handleSaveEditReply,
    setReply,
    setActiveReplyId,
  } = props;

  const handleCancel = () => {
    setReply("");
    setActiveReplyId("");
  };

  return (
    <Reply indent>
      <CommentHeader
        myId={myId}
        getInitials={getInitials}
        index={index}
        repliesIndex={repliesIndex}
        repliesItem={repliesItem}
        shared={repliesItem}
        item={item}
        handleEdit={handleEditReply}
        handleDelete={handleDeleteReply}
      />
      {activeReplyId !== repliesItem.id ? (
        <>
          <CommentsDiv>{repliesItem.commentText}</CommentsDiv>
          {repliesItem.editedTime && (
            <DateWrapper>
              <DateField>
                Edited: {moment(repliesItem.editedTime).calendar()}
              </DateField>
            </DateWrapper>
          )}
        </>
      ) : (
        <>
          <StyledTextArea
            id={`editReply-${repliesItem.id}`}
            inputRef={tag => {
              setReplyRef(tag);
            }}
            value={editReply}
            maxRows={4}
            type="text"
            onChange={({ target }) => setEditReply(target.value)}
            data-test={`reply-txtArea-${index}-${repliesIndex}`}
          />
          <CommentFooterContainer>
            <Button
              id={`btn-save-editedReply-${index}-${repliesIndex}`}
              variant="greyed"
              small-medium
              onClick={() => handleSaveEditReply(item, repliesItem)}
              data-test={`btn-save-editedReply-${index}-${repliesIndex}`}
            >
              Save
            </Button>
            <Button
              id={`btn-cancel-reply-${index}`}
              btn-cancel-reply
              variant="greyed"
              small-medium
              onClick={() => handleCancel()}
              data-test={`btn-cancel-reply-${index}`}
            >
              Cancel
            </Button>
          </CommentFooterContainer>
        </>
      )}
    </Reply>
  );
};

Replies.propTypes = {
  repliesItem: PropTypes.instanceOf(Object).isRequired,
  myId: PropTypes.string.isRequired,
  getInitials: PropTypes.func.isRequired,
  handleEditReply: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  repliesIndex: PropTypes.number.isRequired,
  handleDeleteReply: PropTypes.func.isRequired,
  item: PropTypes.instanceOf(Object).isRequired,
  activeReplyId: PropTypes.string.isRequired,
  setReplyRef: PropTypes.func.isRequired,
  setEditReply: PropTypes.func.isRequired,
  editReply: PropTypes.string.isRequired,
  handleSaveEditReply: PropTypes.func.isRequired,
  setReply: PropTypes.func.isRequired,
  setActiveReplyId: PropTypes.func.isRequired,
};

export default Replies;
