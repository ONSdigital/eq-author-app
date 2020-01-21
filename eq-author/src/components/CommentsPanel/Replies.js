import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styled from "styled-components";
import {
  Reply,
  CommentHeaderContainer,
  AvatarWrapper,
  AvatarOuter,
  AvatarInner,
  NameWrapper,
  DateField,
  EditButton,
  DeleteComment,
  StyledTextArea,
  CommentsDiv,
  DateWrapper,
  CommentFooterContainer,
  SaveButton,
} from "./index";

const FlexLabel = styled.div`
  font-size: 1em;
  align-items: center;
  height: 20px;
  overflow: hidden;
  white-space: nowrap;
  width: 180px;

  @media (max-width: 1700px) {
    width: 138px;
  }

  @media (max-width: 1500px) {
    width: 120px;
    font-size: 0.9em;
  }
  text-overflow: ellipsis;
`;

const FlexLabelReplies = styled(FlexLabel)`
  @media (max-width: 1700px) {
    width: 107px;
  }
`;

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
    editReplyName,
    handleSaveEditReply,
  } = props;
  return (
    <Reply indent>
      <CommentHeaderContainer>
        <AvatarWrapper>
          <AvatarOuter avatarColor={repliesItem.user.id === myId}>
            <AvatarInner>{getInitials(repliesItem.user.name)}</AvatarInner>
          </AvatarOuter>
        </AvatarWrapper>
        <NameWrapper>
          <FlexLabelReplies>{repliesItem.user.displayName}</FlexLabelReplies>
          <DateField>{moment(repliesItem.createdTime).calendar()}</DateField>
        </NameWrapper>
        <EditButton
          hideEditBtn={repliesItem.user.id !== myId}
          onClick={() => handleEditReply(repliesItem)}
          data-test={`btn-edit-reply-${index}-${repliesIndex}`}
        />
        <DeleteComment
          hideDeleteBtn={repliesItem.user.id !== myId}
          onClick={() => handleDeleteReply(item, repliesItem)}
          data-test={`btn-delete-reply-${index}-${repliesIndex}`}
        />
      </CommentHeaderContainer>
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
            name={editReplyName}
            type="text"
            onChange={({ target }) => setEditReply(target.value)}
            data-test={`reply-txtArea-${index}-${repliesIndex}`}
          />
          <CommentFooterContainer>
            <SaveButton
              id={repliesIndex}
              medium
              onClick={() => handleSaveEditReply(item, repliesItem)}
              data-test={`btn-save-editedReply-${index}-${repliesIndex}`}
            >
              Save
            </SaveButton>
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
  editReplyName: PropTypes.string.isRequired,
  handleSaveEditReply: PropTypes.func.isRequired,
};

export default Replies;
