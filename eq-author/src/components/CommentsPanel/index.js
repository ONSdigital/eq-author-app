import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSubscription } from "react-apollo";
import { get } from "lodash";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import { withMe } from "App/MeContext";
import TextArea from "react-textarea-autosize";

import COMMENT_QUERY from "./commentsQuery.graphql";
import COMMENT_ADD from "./createNewComment.graphql";
import COMMENT_DELETE from "./deleteComment.graphql";
import COMMENT_UPDATE from "./updateComment.graphql";
import COMMENT_SUBSCRIPTION from "./commentSubscription.graphql";
import REPLY_ADD from "./createNewReply.graphql";

import { colors, radius } from "constants/theme";

import ScrollPane from "components/ScrollPane";
import Error from "components/Error";
import Loading from "components/Loading";
import DeleteButton from "components/buttons/DeleteButton";
import { sharedStyles } from "components/Forms/css";
import { Field, Label } from "components/Forms";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";

import IconEdit from "./icon-edit.svg";

const CommentsPane = styled.div`
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 1em;
`;

const CommentSection = styled.div`
  padding: 1em;
  border-bottom: 1px solid ${colors.lightMediumGrey};
`;

const StyledScrollPane = styled(ScrollPane)`
  height: auto;
`;

const StyledLabel = styled(Label)`
  margin-bottom: 0;
`;

const SaveButton = styled(Button)`
  padding: 0.3em 0.8em 0.4em;
`;

const ReplyButton = styled(Button)`
  padding: 0.3em 0.8em 0.4em;
  display: ${props => (props.hideReplyBtn ? "none" : "block")};
`;

const CommentsDiv = styled.div`
  align-items: left;
  padding: 0.5em 1em;
  margin-bottom: 5px;
  border: 1px solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  white-space: pre-line;
  overflow: hidden;
  overflow-wrap: break-word;
`;

const StyledTextArea = styled(TextArea)`
  ${sharedStyles};
  resize: none;
  margin-bottom: 0.7em;
  &[disabled] {
    pointer-events: none;
    padding: 0.5em 1em;
    border: 1px solid ${colors.lightGrey};
    background-color: ${colors.lighterGrey};
    word-break: break-word;
    margin-bottom: 0.2em;
  }
`;

const CommentHeaderContainer = styled(Field)`
  display: flex;
  justify-content: flex-start;
  -webkit-align-items: start;
  padding: 0;
  margin: 0;
  margin-bottom: 8px;
`;

const CommentFooterContainer = styled(Field)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

const AvatarWrapper = styled.div`
  flex-grow: 0;
  margin-right: 8px;
`;

const AvatarOuter = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${colors.primary};
  text-align: center;
`;

const AvatarInner = styled.div`
  color: ${colors.white};
  position: relative;
  display: inline-block;
  width: 100%;
  height: 0;
  padding: 22% 0;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: space-between;
  align-items: start;
  flex-grow: 2;
`;

const DateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-grow: 2;
`;

const DeleteComment = styled(DeleteButton)`
  color: ${colors.grey};
  font-size: 2.2em;
  display: ${props => (props.hideDeleteBtn ? "none" : "block")};
`;

const ButtonGroupStyled = styled(ButtonGroup)`
  margin-left: auto;
`;

const EditButtonIcon = styled.button`
  flex: 0 0 auto;
  color: ${colors.grey};
  padding: 1em;
  border-radius: ${radius};
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  line-height: 1;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  text-decoration: none;
  transition: all 100ms ease-out;
  letter-spacing: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-bg);
  background: url(${IconEdit}) no-repeat center center;
  height: 25px;
  width: 25px;
  display: ${props => (props.hideEditBtn ? "none" : "block")};
  &:hover {
    filter: invert(100%) brightness(0.6);
  }
  &:focus,
  &:active {
    outline-width: 0;
  }
  &[disabled] {
    pointer-events: none;
    opacity: 0.6;
  }
`;

const FlexLabel = styled.div`
  font-size: 1em;
  align-items: center;
  height: 20px;
  overflow: hidden;
  white-space: nowrap;
  width: 180px;

  @media (max-width: 1700px) {
    width: 155px;
  }

  @media (max-width: 1500px) {
    width: 120px;
  }
  text-overflow: ellipsis;
`;

const DateField = styled("span")`
  font-weight: normal;
  font-size: 0.8em;
  color: ${colors.grey};
`;

const CommentsPanel = ({
  match: {
    params: { pageId },
  },
  me: { id: myId },
}) => {
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [activeComment, setActiveComment] = useState("");
  const [ref, setRef] = useState();
  const [scrollRef, setScrollRef] = useState();
  const firstRender = useRef(true);
  const [activeReply, setActiveReply] = useState("");

  const { loading, error, data } = useQuery(COMMENT_QUERY, {
    variables: {
      input: { pageId },
    },
  });
  const commentsArray = get(data, "page.comments", []);

  const [createComment] = useMutation(COMMENT_ADD);
  const [deleteComment] = useMutation(COMMENT_DELETE);
  const [updateComment] = useMutation(COMMENT_UPDATE);
  const [createReply] = useMutation(REPLY_ADD);

  useSubscription(COMMENT_SUBSCRIPTION, {
    variables: {
      pageId,
    },
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!activeComment) {
      return;
    }
    ref.focus();
  }, [ref]);

  useEffect(() => {
    if (!scrollRef) {
      return;
    }
    scrollRef.scrollIntoView({ behavior: "smooth" });
  }, [scrollRef]);

  const handleEdit = (id, commentText) => {
    setActiveComment(id);
    setEditComment(commentText);
  };

  const handleSubmit = event => {
    event.preventDefault();
    createComment({
      variables: {
        input: {
          pageId,
          commentText: comment,
        },
      },
    });
    setComment("");
    setActiveComment("");
  };

  const handleDelete = event => {
    const commentId = event.id;
    if (commentId && myId === event.user.id) {
      deleteComment({
        variables: {
          input: {
            pageId,
            commentId,
          },
        },
      });
    }
    setActiveComment("");
  };

  const handleSaveEdit = event => {
    const commentId = event.id;
    if (editComment) {
      updateComment({
        variables: {
          input: {
            pageId,
            commentId,
            commentText: editComment,
          },
        },
      });
      setActiveComment("");
    }
  };

  const handleReply = event => {
    alert(event.target);
  };

  const getInitials = name => {
    if (name !== null) {
      const initials = name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);
      return initials
        .join("")
        .substring(0, 3)
        .toUpperCase();
    }
  };

  if (loading) {
    return <Loading height="100%">Comments loading…</Loading>;
  }
  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  console.log(commentsArray);
  const displayComments = commentsArray.map((item, index) => {
    const repliesArray = commentsArray.replies;
    console.log(repliesArray);
    const editCommentId = `name-${index}`;
    const setScroll = tag => {
      if (index === commentsArray.length - 1) {
        setScrollRef(tag);
      }
    };
    return (
      <CommentSection
        ref={tag => {
          setScroll(tag);
        }}
        key={item.id}
      >
        <CommentHeaderContainer>
          <AvatarWrapper>
            <AvatarOuter>
              <AvatarInner>{getInitials(item.user.name)}</AvatarInner>
            </AvatarOuter>
          </AvatarWrapper>
          <NameWrapper>
            <FlexLabel>{item.user.displayName}</FlexLabel>
            <DateField>{moment(item.createdTime).calendar()}</DateField>
          </NameWrapper>
          <EditButtonIcon
            hideEditBtn={item.user.id !== myId}
            onClick={() => handleEdit(item.id, item.commentText)}
            data-test={`btn-edit-comment-${index}`}
            // disabled={activeComment === item.id}
          />
          <DeleteComment
            hideDeleteBtn={item.user.id !== myId}
            onClick={() => handleDelete(item)}
            data-test={`btn-delete-comment-${index}`}
          />
        </CommentHeaderContainer>
        {activeComment !== item.id ? (
          <CommentsDiv>{item.commentText}</CommentsDiv>
        ) : (
          <StyledTextArea
            id={item.id}
            inputRef={tag => {
              setRef(tag);
            }}
            // disabled={activeComment !== item.id}
            value={editComment}
            name={editCommentId}
            type="text"
            onChange={({ target }) => setEditComment(target.value)}
            data-test={`edit-comment-txtArea-${index}`}
          />
        )}
        <CommentFooterContainer>
          {item.editedTime ? (
            <DateWrapper>
              <DateField>
                Edited: {moment(item.editedTime).calendar()}
              </DateField>
            </DateWrapper>
          ) : (
            ""
          )}
          <ReplyButton
            id={`replyBtn-${index}`}
            hideReplyBtn={activeComment === item.id}
            variant="greyed"
            medium
            onclick={() => setActiveReply(item.id)}
            // onClick={() => handleReply(item)}
            data-test={`btn-reply-comment-${index}`}
          >
            reply
          </ReplyButton>
          {activeComment === item.id && (
            <SaveButton
              id={index}
              medium
              onClick={() => handleSaveEdit(item)}
              data-test={`btn-save-editedComment-${index}`}
            >
              Save
            </SaveButton>
          )}
        </CommentFooterContainer>
        {activeReply !== item.id ? (
          <CommentsDiv>{item.id}</CommentsDiv>
        ) : (
          <StyledTextArea
            // id={`reply-${item.replies[replyIndex].id}`}
            inputRef={tag => {
              setRef(tag);
            }}
            // disabled={activeComment !== item.id}
            value={editComment}
            name={editCommentId}
            type="text"
            // onChange={({ target }) => setReply(target.value)}
            data-test={`reply-txtArea-${index}`}
          />
        )}
      </CommentSection>
    );
  });

  return (
    <CommentsPane>
      <CommentSection>
        <StyledLabel>{"Comments"}</StyledLabel>
      </CommentSection>
      <StyledScrollPane>{displayComments}</StyledScrollPane>
      <CommentSection>
        <Field>
          <StyledTextArea
            id="comments-txt-area"
            name="comment"
            value={comment}
            minRows={5}
            maxRows={5}
            onChange={({ target }) => setComment(target.value)}
            data-test="comment-txt-area"
          />
        </Field>
        <ButtonGroup horizontal align="right">
          <Button
            disabled={!comment}
            variant="primary"
            onClick={handleSubmit}
            data-test="btn-add-comment"
          >
            Add
          </Button>
        </ButtonGroup>
      </CommentSection>
    </CommentsPane>
  );
};

CommentsPanel.propTypes = {
  match: CustomPropTypes.match.isRequired,
  me: CustomPropTypes.me.isRequired,
};

export default withMe(withRouter(CommentsPanel));
