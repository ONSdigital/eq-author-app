import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

import TextareaAutosize from "react-textarea-autosize";
import Button from "components/buttons/Button";
import Collapsible from "components/Collapsible";
import VisuallyHidden from "components/VisuallyHidden";
import Tooltip from "components/Forms/Tooltip";
import AddComment from "../AddComment";

import iconEdit from "assets/icon-edit.svg";
import iconClose from "assets/icon-close.svg";

const IconButton = ({ icon, onClick, children }) => {
  const Button = styled.button`
    padding: 0;
    padding-left: 3px;
    padding-top: 3px;
    background: none;
    border: none;

    &:focus {
      ${focusStyle}
      outline: none;
    }
  `;

  const Icon = styled.span`
    mask: url(${icon});
    width: 2em;
    height: 2em;
    background-color: ${colors.grey};
    border: none;
    display: block;

    &:hover {
      background-color: ${colors.black};
    }
  `;

  return (
    <Tooltip place="top" offset={{ top: 0, bottom: 10 }} content={children}>
      <Button onClick={onClick}>
        <Icon />
        <VisuallyHidden>{children}</VisuallyHidden>
      </Button>
    </Tooltip>
  );
};

export const Comment = ({
  author,
  datePosted,
  text,
  dateModified,
  onUpdateComment,
  onDeleteComment,
  commentId,
  replyId,
  showAddReply,
  showReplyBtn,
}) => {
  const [editing, setEditing] = useState(false);
  const Comment = styled.div`
    margin-bottom: 1em;
  `;

  const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.5em;
  `;

  const Body = styled.div`
    margin-bottom: 0.5em;
  `;

  const ColumnWrapper = styled.div``;

  const Text = styled.p`
    border: 0.0625em solid ${colors.lightGrey};
    background-color: ${colors.lighterGrey};
    padding: 0.5em 1em;
    margin: 0;
    margin-bottom: 0.3125em;
  `;

  const EditText = styled(TextareaAutosize)`
    width: 100%;
    border: thin solid ${colors.grey};
    resize: none;
    font-size: 1em;
    font-family: inherit;
    padding: 0.5em;
    margin-bottom: 0.5em;

    &:focus {
      ${focusStyle}
      outline: none;
    }
  `;

  const Avatar = styled.p`
    width: 2.25em;
    height: 2.25em;
    line-height: 2.25em;
    border-radius: 50%;
    text-align: center;
    color: ${colors.white};
    background-color: ${colors.primary};
    margin: 0;
    margin-right: 0.5em;
    text-transform: uppercase;
  `;

  const Author = styled.p`
    margin: 0;
    text-transform: capitalize;
  `;

  const Date = styled.p`
    font-size: 0.8em;
    color: ${colors.grey};
    margin: 0;
  `;

  const ButtonGroup = styled.div`
    display: flex;

    button {
      margin-right: 0.5em;
    }
  `;

  const RightButtonGroup = styled(ButtonGroup)`
    margin-left: auto;
  `;

  const authorInitials = author
    .match(/\b(\w)/g)
    .splice(0, 2)
    .join("");

  return (
    <Comment>
      <Header>
        <Avatar>{authorInitials}</Avatar>
        <ColumnWrapper>
          <Author>{author}</Author>
          <Date>{moment(datePosted).calendar()}</Date>
        </ColumnWrapper>
        <RightButtonGroup>
          <IconButton
            icon={iconEdit}
            onClick={() => {
              setEditing(true);
              showReplyBtn(false);
              showAddReply(false);
            }}
          >
            Edit comment
          </IconButton>
          <IconButton
            icon={iconClose}
            onClick={() => onDeleteComment(commentId, replyId)}
          >
            Delete comment
          </IconButton>
        </RightButtonGroup>
      </Header>
      <Body>
        {!editing && <Text>{text}</Text>}
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let commentText = e.target.updatedComment.value;
              onUpdateComment(commentId, commentText);
              setEditing(false);
              showReplyBtn(true);
            }}
          >
            <EditText
              id="updatedComment"
              autoFocus
              defaultValue={text}
              required
            />
            <ButtonGroup>
              <Button type="submit" variant="greyed" small-medium>
                Save
              </Button>
              <Button
                variant="greyed"
                small-medium
                onClick={() => {
                  setEditing(false);
                  showReplyBtn(true);
                }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        )}
        {dateModified && (
          <Date>{`Edited: ${moment(dateModified).calendar()}`}</Date>
        )}
      </Body>
    </Comment>
  );
};

const CommentWithReplies = ({
  comment,
  onUpdateComment,
  onDeleteComment,
  replies = [],
  onAddReply,
  onUpdateReply,
  onDeleteReply,
}) => {
  const [addReplyVisible, showAddReply] = useState(false);
  const [replyBtnVisible, showReplyBtn] = useState(true);
  const [editing, setEditing] = useState(false);

  const ReplyBtn = styled(Button)`
    margin-bottom: 1em;
  `;

  const Replies = styled(Collapsible)`
    .collapsible-title,
    .collapsible-title > * {
      font-weight: normal;
      padding: 0;
    }

    .collapsible-header {
      margin-bottom: 1em;
    }

    .collapsible-body {
      border-left: none;
      margin-top: 0;
    }

    ul {
      padding: 0;

      li {
        display: block;
      }
    }
  `;

  const numOfReplies = replies.length;

  const buildReplies = (
    commentId,
    replies,
    onUpdateReply,
    onDeleteReply,
    showAddReply,
    showReplyBtn
  ) =>
    replies.map(({ id, ...rest }) => (
      <li key={`comment-${id}`}>
        <Comment
          commentId={commentId}
          replyId={id}
          onUpdateComment={onUpdateReply}
          onDeleteComment={onDeleteReply}
          showAddReply={showAddReply}
          showReplyBtn={showReplyBtn}
          {...rest}
        />
      </li>
    ));

  return (
    <>
      <Comment
        commentId={comment.id}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        showAddReply={showAddReply}
        showReplyBtn={showReplyBtn}
        {...comment}
      />
      {!addReplyVisible && replyBtnVisible && (
        <ReplyBtn
          variant="greyed"
          small-medium
          onClick={() => showAddReply(true)}
        >
          Reply
        </ReplyBtn>
      )}
      {addReplyVisible && (
        <AddComment
          key={`add-comment-${comment.id}`}
          autoFocus
          cancel
          commentId={comment.id}
          onAdd={(commentText, commentId) => {
            onAddReply(commentText, commentId);
            showAddReply(false);
          }}
          onCancel={() => showAddReply(false)}
        />
      )}
      {numOfReplies > 0 ? (
        <Replies
          title={`${numOfReplies} ${numOfReplies > 1 ? "replies" : "reply"}`}
          showHide
          withoutHideThis
        >
          <ul>
            {buildReplies(
              comment.id,
              replies,
              onUpdateReply,
              onDeleteReply,
              showAddReply,
              showReplyBtn
            )}
          </ul>
        </Replies>
      ) : null}
    </>
  );
};

CommentWithReplies.propTypes = {
  /**
   The root comment.
  */
  comment: PropTypes.shape({
    author: PropTypes.string.isRequired,
    datePosted: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    onUpdateComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
    commentId: PropTypes.string,
  }).isRequired,
  /**
   Replies to the root comment.
  */
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string.isRequired,
      datePosted: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      dateModified: PropTypes.string.isRequired,
      onUpdateComment: PropTypes.func,
      onDeleteComment: PropTypes.func,
      commentId: PropTypes.string,
      replyId: PropTypes.string,
    })
  ),
  /**
   Updates the root comment.

   Params:
  
  - `commentId` ~ The ID of the comment being updated
  */
  onUpdateComment: PropTypes.func.isRequired,
  /**
   Deletes the root comment.

   Params:
  
  - `commentId` ~ The ID of the comment being deleted
  */
  onDeleteComment: PropTypes.func.isRequired,
  /**
   Adds a reply to the root comment.

   Params:
  
  - `commentId` ~ The ID of root comment being replied to
  */
  onAddReply: PropTypes.func.isRequired,
  /**
   Updates a reply to the root comment.
  */
  onUpdateReply: PropTypes.func.isRequired,
  /**
   Deletes a reply to the root comment.

   Params:
  
  - `commentId` ~ The ID of the root comment of the reply being deleted
  - `replyId` ~ The ID of the reply being deleted

  */
  onDeleteReply: PropTypes.func.isRequired,
};

export default CommentWithReplies;
