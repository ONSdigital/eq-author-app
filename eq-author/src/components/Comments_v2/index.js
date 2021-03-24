import React from "react";
import styled from "styled-components";

import { useQuery } from "@apollo/react-hooks";
import COMMENT_QUERY from "./graphql/commentsQuery.graphql";

import Error from "components/Error";
import Loading from "components/Loading";
import Comment from "./Comment";

export default ({ componentId }) => {
  const Wrapper = styled.div`
    padding: 1em;

    ul {
      padding: 0;

      li {
        display: block;
      }
    }
  `;

  const { loading, error, data } = useQuery(COMMENT_QUERY, {
    variables: {
      componentId,
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
      <ul>{renderComments(formattedComments)}</ul>
    </Wrapper>
  );
};
