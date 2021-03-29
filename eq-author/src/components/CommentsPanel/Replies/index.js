import React from "react";
import styled from "styled-components";

import Collapsible from "components/Collapsible";
import { Comment } from "../Comment";

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
            ))}
          </ul>
        </StyledCollapsible>
      )}
    </>
  );
};

export default Replies;
