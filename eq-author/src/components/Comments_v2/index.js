import React from "react";
import styled from "styled-components";

import { colors, focusStyle } from "constants/theme";

import { useQuery } from "@apollo/react-hooks";
import { useSubscription } from "react-apollo";

import COMMENT_QUERY from "./graphql/commentsQuery.graphql";
import COMMENT_SUBSCRIPTION from "./graphql/commentSubscription.graphql";

import Error from "components/Error";
import Button from "components/buttons/Button";
import Loading from "components/Loading";
import Comment from "./Comment";

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

  const TextArea = styled.textarea`
    height: 94px;
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

  const renderComments = (comments = []) =>
    comments.map(({ id, replies, ...rest }) => (
      <li key={`comment-${id}`}>
        <Comment id={id} comment={{ id, ...rest }} replies={replies} />
      </li>
    ));

  return (
    <Wrapper>
      <h1>Comments</h1>
      <TextArea />
      <Button variant="greyed" small-medium>
        Add
      </Button>
      <ul>{renderComments(formattedComments)}</ul>
    </Wrapper>
  );
};
