import React from "react";
import styled from "styled-components";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSubscription } from "react-apollo";

import COMMENT_QUERY from "./graphql/commentsQuery.graphql";

import COMMENT_ADD from "./graphql/createNewComment.graphql";
import COMMENT_DELETE from "./graphql/deleteComment.graphql";
import REPLY_ADD from "./graphql/createNewReply.graphql";
import REPLY_DELETE from "./graphql/deleteReply.graphql";

import COMMENT_SUBSCRIPTION from "./graphql/commentSubscription.graphql";

import Error from "components/Error";
import Loading from "components/Loading";
import Comment from "./Comment";
import AddComment from "./AddComment";

export default ({ componentId }) => {
  const Wrapper = styled.section`
    padding: 1em;

    h1 {
      font-size: 1em;
      margin-top: 0;
    }

    ul {
      padding: 0;

      li {
        display: block;
      }
    }
  `;

  const [createComment] = useMutation(COMMENT_ADD, {});
  const [deleteComment] = useMutation(COMMENT_DELETE, {});
  const [createReply] = useMutation(REPLY_ADD, {});
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
      <AddComment
        key={`add-comment-${componentId}`}
        onAdd={(commentText) =>
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
