import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

import VisuallyHidden from "components/VisuallyHidden";
import Tooltip from "components/Forms/Tooltip";
import CommentEditor from "components/Comments/CommentEditor";

import iconEdit from "assets/icon-edit.svg";
import iconClose from "assets/icon-close.svg";

const IconButton = ({
  icon,
  onClick,
  children,
  "data-test": dataTest,
  ...rest
}) => {
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
    <Tooltip
      place="top"
      offset={{ top: 0, bottom: 10 }}
      content={children}
      {...rest}
    >
      <Button onClick={onClick} data-test={dataTest}>
        <Icon />
        <VisuallyHidden>{children}</VisuallyHidden>
      </Button>
    </Tooltip>
  );
};

const PureComment = ({
  author,
  canEdit,
  canDelete,
  datePosted,
  text,
  dateModified,
  onUpdateComment,
  onDeleteComment,
  commentId,
  replyId,
  showAddReply,
  showReplyBtn,
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

    button {
      margin-right: 0.5em;
    }
  `;

  const RightButtonGroup = styled(ButtonGroup)`
    margin-left: auto;
  `;

  const authorInitials = author
    .match(/\b(\w)/g)
    .splice(0, 2)
    .join("");

  const [editing, setEditing] = useState(false);

  return (
    <Comment data-test="PureComment">
      <Header data-test="PureComment__Header">
        <Avatar data-test="PureComment__Avatar">{authorInitials}</Avatar>
        <ColumnWrapper>
          <Author data-test="PureComment__Author">{author}</Author>
          <Date data-test="PureComment__DatePosted">
            {moment(datePosted).calendar()}
          </Date>
        </ColumnWrapper>
        <RightButtonGroup>
          {canEdit && (
            <IconButton
              data-test="PureComment__EditCommentBtn"
              icon={iconEdit}
              onClick={() => {
                setEditing(true);
                showReplyBtn(false);
                showAddReply(false);
              }}
            >
              Edit comment
            </IconButton>
          )}

          {canDelete && (
            <IconButton
              data-test="PureComment__DeleteCommentBtn"
              icon={iconClose}
              onClick={() => onDeleteComment(commentId, replyId)}
            >
              Delete comment
            </IconButton>
          )}
        </RightButtonGroup>
      </Header>
      <Body data-test="PureComment__Body">
        {editing ? (
          <CommentEditor
            data-test="PureComment__CommentEditor"
            showCancel
            confirmText={"Save"}
            replyId={replyId}
            commentId={commentId}
            initialValue={text}
            variant={"growable"}
            onConfirm={(commentText, commentId, replyId) => {
              onUpdateComment(commentId, commentText, replyId);
              setEditing(false);
              showReplyBtn(true);
            }}
            onCancel={() => {
              setEditing(false);
              showReplyBtn(true);
            }}
          />
        ) : <Text data-test="PureComment__CommentText">{text}</Text>}
        {dateModified && (
          <Date data-test="PureComment__DateModified">{`Edited: ${moment(
            dateModified
          ).calendar()}`}</Date>
        )}
      </Body>
    </Comment>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  "data-test": PropTypes.string,
};

PureComment.propTypes = {
  /**
   * The ID of the comment. If the comment is a reply, this is the ID of the root comment.
   */
  commentId: PropTypes.string.isRequired,
  /**
   * The ID of the reply to the root comment.
   */
  replyId: PropTypes.string,
  /**
   * The name of the entity who made the comment.
   */
  author: PropTypes.string.isRequired,
  /**
   * When true, the 'Edit' button is enabled.
   */
  canEdit: PropTypes.bool.isRequired,
  /**
   * When true, the 'Delete' button is enabled.
   */
  canDelete: PropTypes.bool.isRequired,
  /**
   * In dateTime format, the date when the comment was made.
   */
  datePosted: PropTypes.string.isRequired,
  /**
   * The comment text.
   */
  text: PropTypes.string.isRequired,
  /**
   * In dateTime format, the date when the comment was last modified.
   */
  dateModified: PropTypes.string,
  /**
   * The function that runs when the 'Save' button is pressed when updating a comment.
   */
  onUpdateComment: PropTypes.func.isRequired,
  /**
   * The function that runs when the 'Delete' button is pressed.
   */
  onDeleteComment: PropTypes.func.isRequired,
  /**
   * If replies are enabled, this function is called to hide the 'Add reply' form when the 'Edit' button is pressed.
   */
  showAddReply: PropTypes.func,
  /**
   * If replies are enabled, this function is called to hide the 'Reply' button when the 'Edit' button is called, and show it when the user has finished editing.
   */
  showReplyBtn: PropTypes.func,
};

export default PureComment;
