import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CommentEditor from "../CommentEditor";
import Collapsible from "components/Collapsible";
import Button from "components/buttons/Button";

import PureComment from "../PureComment";

const StyledCollapsible = styled(Collapsible)`
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

const Replies = ({
  replies,
  commentId,
  onUpdateReply,
  onDeleteReply,
  showAddReply,
  showReplyBtn,
}) => {
  const numOfReplies = replies.length;

  return (
    <>
      {numOfReplies === 0 && <React.Fragment />}
      {numOfReplies > 0 && (
        <StyledCollapsible
          title={`${numOfReplies} ${numOfReplies > 1 ? "replies" : "reply"}`}
          showHide
          withoutHideThis
          key={`replies-to-${commentId}`}
        >
          <ul>
            {replies.map(({ id, ...rest }) => (
              <li key={`list-item-comment-${id}`}>
                <PureComment
                  commentId={commentId}
                  replyId={id}
                  onUpdateComment={onUpdateReply}
                  onDeleteComment={onDeleteReply}
                  showAddReply={showAddReply}
                  showReplyBtn={showReplyBtn}
                  {...rest}
                />
              </li>
            ))}
          </ul>
        </StyledCollapsible>
      )}
    </>
  );
};

const Comment = ({
  comment,
  onUpdateComment,
  onDeleteComment,
  replies = [],
  onAddReply,
  onUpdateReply,
  onDeleteReply,
  disableReplies = false,
}) => {
  const [addReplyVisible, showAddReply] = useState(false);
  const [replyBtnVisible, showReplyBtn] = useState(!disableReplies);

  const ReplyBtn = styled(Button)`
    margin-bottom: 1em;
  `;

  return (
    <div data-test="Comment">
      <PureComment
        commentId={comment.id}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        showAddReply={showAddReply}
        showReplyBtn={showReplyBtn}
        {...comment}
      />
      {!addReplyVisible && replyBtnVisible && (
        <ReplyBtn
          data-test="Comment__ReplyBtn"
          variant="greyed"
          small-medium
          onClick={() => showAddReply(true)}
        >
          Reply
        </ReplyBtn>
      )}
      {addReplyVisible && (
        <CommentEditor
          key={`add-comment-${comment.id}`}
          showCancel
          commentId={comment.id}
          onConfirm={(commentText, commentId) =>
            onAddReply(commentText, commentId, () => {
              showAddReply(false);
            })
          }
          onCancel={() => showAddReply(false)}
        />
      )}
      <Replies
        data-test="Comment__Replies"
        commentId={comment.id}
        replies={replies}
        onUpdateReply={onUpdateReply}
        onDeleteReply={onDeleteReply}
        showAddReply={showAddReply}
        showReplyBtn={showReplyBtn}
      />
    </div>
  );
};

Replies.propTypes = {
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string.isRequired,
      datePosted: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      dateModified: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  commentId: PropTypes.string,
  onUpdateReply: PropTypes.func.isRequired,
  onDeleteReply: PropTypes.func.isRequired,
  showAddReply: PropTypes.func,
  showReplyBtn: PropTypes.func,
};

Comment.propTypes = {
  /**
   The root comment.
  */
  comment: PropTypes.shape({
    author: PropTypes.string.isRequired,
    datePosted: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    dateModified: PropTypes.string,
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
      dateModified: PropTypes.string,
      commentId: PropTypes.string,
      replyId: PropTypes.string,
    })
  ),
  /**
   Enables or disables the ability to reply to the root comment.
   */
  disableReplies: PropTypes.bool,
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

export default Comment;
