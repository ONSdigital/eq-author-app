import React, { useState } from "react";

import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

import Button from "components/buttons/Button";
import Collapsible from "components/Collapsible";

const Comment = ({ author, datePosted, text, dateModified }) => {
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
  `;

  const Author = styled.p`
    margin: 0;
  `;

  const Date = styled.p`
    font-size: 0.8em;
    color: ${colors.grey};
    margin: 0;
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
          <Date>{datePosted}</Date>
        </ColumnWrapper>
      </Header>
      <Body>
        <Text>{text}</Text>
        <Date>{dateModified}</Date>
      </Body>
    </Comment>
  );
};

const AddReply = ({ closeAddReply, onAddReply }) => {
  const AddReply = styled.div`
    margin-bottom: 0.5em;
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
  const ButtonGroup = styled.div`
    display: flex;

    button {
      margin-right: 0.5em;
    }
  `;

  return (
    <AddReply>
      <TextArea />
      <ButtonGroup>
        <Button
          variant="greyed"
          small-medium
          onClick={() => {
            onAddReply();
            closeAddReply();
          }}
        >
          Add
        </Button>
        <Button variant="greyed" small-medium onClick={closeAddReply}>
          Cancel
        </Button>
      </ButtonGroup>
    </AddReply>
  );
};

export default ({ replies = [], onAddReply, ...rest }) => {
  const [addReplyVisible, showAddReply] = useState(false);

  const Reply = styled(Button)`
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
  `;

  const numOfReplies = replies.length;

  const buildReplies = (replies) =>
    replies.map(({ id, ...rest }) => (
      <Comment key={`comment-${id}`} {...rest} />
    ));

  return (
    <>
      <Comment {...rest} />
      {!addReplyVisible && (
        <Reply variant="greyed" small-medium onClick={() => showAddReply(true)}>
          Reply
        </Reply>
      )}
      {addReplyVisible && (
        <AddReply
          onAddReply={onAddReply}
          closeAddReply={() => showAddReply(false)}
        />
      )}
      {numOfReplies > 0 ? (
        <Replies
          title={`${numOfReplies} ${numOfReplies > 1 ? "replies" : "reply"}`}
          showHide
          withoutHideThis
        >
          {buildReplies(replies)}
        </Replies>
      ) : null}
    </>
  );
};
