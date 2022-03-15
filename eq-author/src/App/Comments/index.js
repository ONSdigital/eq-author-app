import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { useMutation } from "@apollo/react-hooks";
import { useMe } from "App/MeContext";
import { colors } from "constants/theme";

import COMMENT_ADD from "./graphql/createNewComment.graphql";
import REPLY_ADD from "./graphql/createNewReply.graphql";

import UPDATE_COMMENTS_AS_READ from "graphql/updateCommentsAsRead.graphql";

import Error from "components/Error";
import Loading from "components/Loading";
import Comment from "components/Comments/Comment";
import CommentEditor from "components/Comments/CommentEditor";
import Collapsible from "components/Collapsible";

const Wrapper = styled.section`
  h1 {
    font-size: 1em;
    margin: 0;
    padding: 1em;
    padding-bottom: 0;
  }

  > ul > li,
  .AddComment {
    padding: 1em;
    padding-bottom: 0;
  }

  > ul {
    padding: 0;

    > li {
      display: block;
      border-top: 1px solid rgb(228, 232, 235);
    }
  }
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
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

const CommentsPanel = ({ error, loading, comments, componentId }) => {
  const { me } = useMe();
  const { id: userId } = me;

  const [createComment] = useMutation(COMMENT_ADD);
  const [createReply] = useMutation(REPLY_ADD);
  const [updateCommentsAsRead] = useMutation(UPDATE_COMMENTS_AS_READ);

  // https://stackoverflow.com/questions/66404382/how-to-detect-route-changes-using-react-router-in-react
  useEffect(() => {
    return function cleanup() {
      updateCommentsAsRead({
        variables: {
          input: {
            pageId: componentId,
            userId,
          },
        },
      });
    };
  }, [updateCommentsAsRead, componentId, userId]);

  if (!comments) {
    comments = [];
  }

  if (loading) {
    return <Loading height="100%">Comments loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  const formatName = (name) =>
    name.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

  const sortByDate = (commentArr) =>
    commentArr.sort((a, b) =>
      b.datePosted.toString().localeCompare(a.datePosted.toString())
    );

  const formatComment = ({
    id,
    user,
    commentText,
    readBy,
    createdTime,
    editedTime,
  }) => ({
    id,
    authorName: formatName(user.displayName) || user.name || "",
    canEdit: user.id === me.id,
    canDelete: user.id === me.id,
    readBy,
    datePosted: createdTime,
    dateModified: editedTime,
    commentText,
  });

  const formattedComments = sortByDate(
    comments.map(({ replies, ...rest }) => ({
      ...formatComment(rest),
      replies: sortByDate(
        replies.map((comment) => ({
          ...formatComment(comment),
        }))
      ),
    }))
  );

  const renderReplies = (replies, rootId, componentId) => (
    <ul>
      {replies.map(({ id: replyId, ...rest }) => (
        <li key={`comment-reply-${replyId}`}>
          <Comment
            {...rest}
            id={replyId}
            rootId={rootId}
            subjectId={componentId}
            isReply
          />
        </li>
      ))}
    </ul>
  );

  const hasUnreadReplies = (replies) => {
    let hasNotRead = false;
    replies.forEach((reply) => {
      if (!reply.readBy.some((id) => id === userId)) {
        hasNotRead = true;
      }
    });
    return hasNotRead;
  };

  const renderComments = (comments = [], componentId) => (
    <ul>
      {comments.map(({ id: commentId, replies, ...rest }) => (
        <li key={`comment-${commentId}`} data-test={`Comment-${commentId}`}>
          <Comment
            {...rest}
            id={commentId}
            rootId={commentId}
            subjectId={componentId}
          />
          <CommentEditor
            canClose
            startClosed
            onConfirm={(commentText) =>
              createReply({
                variables: {
                  input: {
                    componentId,
                    commentId,
                    commentText,
                  },
                },
              })
            }
          />
          {replies.length > 0 && (
            <Replies
              showHide
              title={`${replies.length} ${
                replies.length > 1 ? "replies" : "reply"
              }`}
              withoutHideThis
              defaultOpen={hasUnreadReplies(replies)}
            >
              {renderReplies(replies, commentId, componentId)}
            </Replies>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Wrapper data-test="comments-panel" tabIndex="-1" className="keyNav">
      <h1>Comments</h1>
      <CommentEditor
        key={`add-comment-${componentId}`}
        className="AddComment"
        variant={"growable"}
        onConfirm={(commentText) =>
          createComment({
            variables: {
              input: {
                componentId,
                commentText,
              },
            },
          })
        }
      />
      {renderComments(formattedComments, componentId)}
    </Wrapper>
  );
};

CommentsPanel.propTypes = {
  /**
   * The ID of the component users are commenting on. This may be a page, question page, calculated summary, etc.
   */
  componentId: PropTypes.string.isRequired,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  comments: PropTypes.array, //eslint-disable-line
};

export default CommentsPanel;
