import React, { useState, useCallback } from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import moment from "moment";
import { useMe } from "App/MeContext";

import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

import COMMENT_UPDATE from "./graphql/updateComment.graphql";
import COMMENT_DELETE from "./graphql/deleteComment.graphql";
import REPLY_UPDATE from "./graphql/updateReply.graphql";
import REPLY_DELETE from "./graphql/deleteReply.graphql";

import VisuallyHidden from "components/VisuallyHidden";
import Tooltip from "components/Forms/Tooltip";
import CommentEditor from "components/Comments/CommentEditor";
import CommentHighlight from "components/Comments/CommentHighlight";

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
      cursor: pointer;
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

const Wrapper = styled.div`
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
  overflow-wrap: break-word;
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

const Comment = ({
  id,
  rootId,
  subjectId,
  authorName,
  datePosted,
  dateModified,
  commentText,
  readBy,
  isReply = false,
  canEdit = false,
  canDelete = false,
}) => {
  const { me } = useMe();
  const [updateComment] = useMutation(COMMENT_UPDATE);
  const [deleteComment] = useMutation(COMMENT_DELETE);

  const [updateReply] = useMutation(REPLY_UPDATE);
  const [deleteReply] = useMutation(REPLY_DELETE);

  const userReadComment = readBy?.some((id) => id === me.id);

  const [editing, setEditing] = useState(false);

  const authorInitials = authorName
    .match(/\b(\w)/g)
    .splice(0, 2)
    .join("");

  const onUpdateComment = useCallback(
    (commentText) => {
      if (isReply) {
        updateReply({
          variables: {
            input: {
              componentId: subjectId,
              commentId: rootId,
              replyId: id,
              commentText,
            },
          },
        });
      } else {
        updateComment({
          variables: {
            input: {
              componentId: subjectId,
              commentId: id,
              commentText,
            },
          },
        });
      }
    },
    [id, subjectId, rootId, isReply, updateComment, updateReply]
  );

  const onDeleteComment = useCallback(() => {
    if (isReply) {
      deleteReply({
        variables: {
          input: {
            componentId: subjectId,
            commentId: rootId,
            replyId: id,
          },
        },
      });
    } else {
      deleteComment({
        variables: {
          input: {
            componentId: subjectId,
            commentId: id,
          },
        },
      });
    }
  }, [id, subjectId, rootId, isReply, deleteReply, deleteComment]);

  return (
    <>
      {!userReadComment ? (
        <CommentHighlight>
          <Wrapper data-test="Comment">
            <Header data-test="Comment__Header">
              <Avatar data-test="Comment__Avatar">{authorInitials}</Avatar>
              <ColumnWrapper>
                <Author data-test="Comment__Author">{authorName}</Author>
                <Date data-test="Comment__DatePosted">
                  {moment(datePosted).calendar()}
                </Date>
              </ColumnWrapper>
              <RightButtonGroup>
                {canEdit && (
                  <IconButton
                    data-test="Comment__EditCommentBtn"
                    icon={iconEdit}
                    onClick={() => {
                      setEditing(true);
                    }}
                  >
                    Edit comment
                  </IconButton>
                )}

                {canDelete && (
                  <IconButton
                    data-test="Comment__DeleteCommentBtn"
                    icon={iconClose}
                    onClick={() => onDeleteComment()}
                  >
                    Delete comment
                  </IconButton>
                )}
              </RightButtonGroup>
            </Header>
            <Body data-test="Comment__Body">
              {editing ? (
                <CommentEditor
                  data-test="Comment__CommentEditor"
                  canClose
                  confirmText={"Save"}
                  initialValue={commentText}
                  variant={"growable"}
                  onConfirm={(commentText) => {
                    onUpdateComment(commentText);
                    setEditing(false);
                  }}
                  onCancel={() => {
                    setEditing(false);
                  }}
                />
              ) : (
                <Text data-test="Comment__CommentText">{commentText}</Text>
              )}
              {dateModified && (
                <Date data-test="Comment__DateModified">{`Edited: ${moment(
                  dateModified
                ).calendar()}`}</Date>
              )}
            </Body>
          </Wrapper>
        </CommentHighlight>
      ) : (
        <Wrapper data-test="Comment">
          <Header data-test="Comment__Header">
            <Avatar data-test="Comment__Avatar">{authorInitials}</Avatar>
            <ColumnWrapper>
              <Author data-test="Comment__Author">{authorName}</Author>
              <Date data-test="Comment__DatePosted">
                {moment(datePosted).calendar()}
              </Date>
            </ColumnWrapper>
            <RightButtonGroup>
              {canEdit && (
                <IconButton
                  data-test="Comment__EditCommentBtn"
                  icon={iconEdit}
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  Edit comment
                </IconButton>
              )}

              {canDelete && (
                <IconButton
                  data-test="Comment__DeleteCommentBtn"
                  icon={iconClose}
                  onClick={() => onDeleteComment()}
                >
                  Delete comment
                </IconButton>
              )}
            </RightButtonGroup>
          </Header>
          <Body data-test="Comment__Body">
            {editing ? (
              <CommentEditor
                data-test="Comment__CommentEditor"
                canClose
                confirmText={"Save"}
                initialValue={commentText}
                variant={"growable"}
                onConfirm={(commentText) => {
                  onUpdateComment(commentText);
                  setEditing(false);
                }}
                onCancel={() => {
                  setEditing(false);
                }}
              />
            ) : (
              <Text data-test="Comment__CommentText">{commentText}</Text>
            )}
            {dateModified && (
              <Date data-test="Comment__DateModified">{`Edited: ${moment(
                dateModified
              ).calendar()}`}</Date>
            )}
          </Body>
        </Wrapper>
      )}
    </>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  "data-test": PropTypes.string,
};

Comment.propTypes = {
  /**
   * The ID of the comment.
   */
  id: PropTypes.string.isRequired,
  /**
   * The ID of the comment at the root of the chain.
   * If the comment is the one at the root of the chain,
   * the value of this will be equal to ID.
   */
  rootId: PropTypes.string.isRequired,
  /**
   * The ID of the entity that is being commented on. For example,
   * this may be the ID of a question or calculated summary page.
   */
  subjectId: PropTypes.string.isRequired,
  /**
   * The name of the individual who wrote the comment.
   */
  authorName: PropTypes.string.isRequired,
  /**
   * The date the comment was posted.
   */
  datePosted: PropTypes.string.isRequired,
  /**
   * The date the comment was last modified.
   */
  dateModified: PropTypes.string,
  /**
   * The content of the comment.
   */
  commentText: PropTypes.string.isRequired,
  /**
   * The IDs of the users who have read the comment.
   */
  readBy: PropTypes.array, //eslint-disable-line
  /**
   * Denotes whether the comment is at the root of the chain, or is replying to another comment.
   */
  isReply: PropTypes.bool,
  /**
   * Whether or not the comment can be edited.
   */
  canEdit: PropTypes.bool,
  /**
   * Whether or not the comment can be deleted.
   */
  canDelete: PropTypes.bool,
};

export default Comment;
