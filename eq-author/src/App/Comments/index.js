import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSubscription } from "react-apollo";

import COMMENT_QUERY from "./graphql/commentsQuery.graphql";

import COMMENT_ADD from "./graphql/createNewComment.graphql";
import COMMENT_UPDATE from "./graphql/updateComment.graphql";
import COMMENT_DELETE from "./graphql/deleteComment.graphql";
import REPLY_ADD from "./graphql/createNewReply.graphql";
import REPLY_UPDATE from "./graphql/updateReply.graphql";
import REPLY_DELETE from "./graphql/deleteReply.graphql";

import COMMENT_SUBSCRIPTION from "./graphql/commentSubscription.graphql";

import Error from "components/Error";
import Loading from "components/Loading";
import Comment from "components/Comments/Comment";
import CommentEditor from "components/Comments/CommentEditor";

const CommentsPanel = ({ componentId }) => {
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
  `;

  const [createComment] = useMutation(COMMENT_ADD, {});
  const [updateComment] = useMutation(COMMENT_UPDATE, {});
  const [deleteComment] = useMutation(COMMENT_DELETE, {});
  const [createReply] = useMutation(REPLY_ADD, {});
  const [updateReply] = useMutation(REPLY_UPDATE, {});
  const [deleteReply] = useMutation(REPLY_DELETE, {});

  const { loading, error, data, refetch } = useQuery(COMMENT_QUERY, {
    variables: {
      componentId,
    },
  });

  useSubscription(COMMENT_SUBSCRIPTION, {
    variables: {
      id: componentId,
    },
    onSubscriptionData: () => {
      refetch();
    },
  });

  if (loading) {
    return <Loading height="100%">Comments loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  const { comments } = data;

  const formattedComments = comments.map(
    ({ id, user, commentText, createdTime, editedTime, replies }) => ({
      id,
      author: user.displayName || user.name || "",
      datePosted: createdTime,
      dateModified: editedTime,
      text: commentText,
      replies: replies.map(
        ({ id, user, commentText, createdTime, editedTime }) => ({
          id,
          author: user.displayName || user.name || "",
          datePosted: createdTime,
          dateModified: editedTime,
          text: commentText,
        })
      ),
    })
  );

  const renderComments = (comments = [], componentId) =>
    comments.map(({ id, replies, ...rest }) => (
      <li key={`comment-${id}`}>
        <Comment
          comment={{ id, ...rest }}
          replies={replies}
          onUpdateComment={(commentId, commentText) =>
            updateComment({
              variables: {
                input: {
                  componentId,
                  commentId,
                  commentText,
                },
              },
            })
          }
          onDeleteComment={(commentId) =>
            deleteComment({
              variables: {
                input: {
                  componentId,
                  commentId,
                },
              },
            })
          }
          onAddReply={(commentText, commentId) =>
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
          onUpdateReply={(commentId, commentText, replyId) =>
            updateReply({
              variables: {
                input: {
                  componentId,
                  commentId,
                  replyId,
                  commentText,
                },
              },
            })
          }
          onDeleteReply={(commentId, replyId) =>
            deleteReply({
              variables: {
                input: {
                  componentId,
                  commentId,
                  replyId,
                },
              },
            })
          }
        />
      </li>
    ));

  return (
    <Wrapper>
      <h1>Comments</h1>
      <CommentEditor
        key={`add-comment-${componentId}`}
        className="AddComment"
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
      <ul>{renderComments(formattedComments, componentId)}</ul>
    </Wrapper>
  );
};

CommentsPanel.propTypes = {
  /**
   * The ID of the component users are commenting on. This may be a page, question page, calculated summary, etc.
   */
  componentId: PropTypes.string.isRequired,
};

export default CommentsPanel;
