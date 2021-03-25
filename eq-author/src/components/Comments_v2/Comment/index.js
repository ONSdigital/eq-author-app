import React, { useState } from "react";
import moment from "moment";

import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

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
}) => {
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
    margin-left: auto;

    button {
      margin-right: 0.5em;
    }
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
        <ButtonGroup>
          <IconButton icon={iconEdit} onClick={() => onUpdateComment()}>
            Edit comment
          </IconButton>
          <IconButton icon={iconClose} onClick={() => onDeleteComment()}>
            Delete comment
          </IconButton>
        </ButtonGroup>
      </Header>
      <Body>
        <Text>{text}</Text>
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

  const buildReplies = (replies, onUpdateReply, onDeleteReply) =>
    replies.map(({ id, ...rest }) => (
      <li key={`comment-${id}`}>
        <Comment
          id={id}
          onUpdateComment={onUpdateReply}
          onDeleteComment={onDeleteReply}
          {...rest}
        />
      </li>
    ));

  return (
    <>
      <Comment
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        {...comment}
      />
      {!addReplyVisible && (
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
          autoFocus
          cancel
          onAdd={() => {
            onAddReply();
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
          <ul>{buildReplies(replies, onUpdateReply, onDeleteReply)}</ul>
        </Replies>
      ) : null}
    </>
  );
};

export default CommentWithReplies;
