import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSubscription } from "react-apollo";
import { useMe } from "App/MeContext";

import COMMENT_QUERY from "./graphql/commentsQuery.graphql";

import COMMENT_ADD from "./graphql/createNewComment.graphql";
import REPLY_ADD from "./graphql/createNewReply.graphql";

import COMMENT_SUBSCRIPTION from "./graphql/commentSubscription.graphql";

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

const CommentsPanel = ({ componentId }) => {
  const [createComment] = useMutation(COMMENT_ADD);
  const [createReply] = useMutation(REPLY_ADD);

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

  const { me } = useMe();

  if (loading) {
    return <Loading height="100%">Comments loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  const { comments } = data;

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
    createdTime,
    editedTime,
  }) => ({
    id,
    authorName: formatName(user.displayName) || user.name || "",
    canEdit: user.id === me.id,
    canDelete: user.id === me.id,
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
            >
              {renderReplies(replies, commentId, componentId)}
            </Replies>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Wrapper data-test="comments-panel">
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
      {renderComments(formattedComments, componentId)}
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
