import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSubscription } from "react-apollo";
import { get } from "lodash";
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
import REPLY_DELETE from "./deleteReply.graphql";
import REPLY_UPDATE from "./updateReply.graphql";

import { colors, radius } from "constants/theme";

import Error from "components/Error";
import Loading from "components/Loading";
import DeleteButton from "components/buttons/DeleteButton";
import { sharedStyles } from "components/Forms/css";
import { Field } from "components/Forms";
import Button from "components/buttons/Button";
import Replies from "./Replies";
import CommentSection from "./CommentSection";
import EditComment from "./EditComment";
import IconEdit from "./icon-edit.svg";

export const Reply = styled.div`
  padding-top: 0.5em;
  padding-left: ${props => (props.indent ? "1em" : "0")};
`;

export const SaveButton = styled(Button)`
  padding: 0.3em 0.8em 0.4em;
`;

export const CommentsDiv = styled.div`
  align-items: left;
  padding: 0.5em 1em;
  margin-bottom: 5px;
  border: 1px solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  white-space: pre-line;
  overflow: hidden;
  overflow-wrap: break-word;
`;

export const StyledTextArea = styled(TextArea)`
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

export const CommentHeaderContainer = styled(Field)`
  display: flex;
  justify-content: flex-start;
  -webkit-align-items: start;
  padding: 0;
  margin: 0;
  margin-bottom: 8px;
`;

export const CommentFooterContainer = styled(Field)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

export const AvatarWrapper = styled.div`
  flex-grow: 0;
  margin-right: 8px;

  @media (max-width: 1400px) {
    display: none;
  }
`;

export const AvatarOuter = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props =>
    props.avatarColor ? colors.primary : colors.grey};
  text-align: center;
`;

export const AvatarInner = styled.div`
  color: ${colors.white};
  position: relative;
  display: inline-block;
  width: 100%;
  height: 0;
  padding: 22% 0;
`;

export const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: space-between;
  align-items: start;
  flex-grow: 2;
`;

export const DateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-grow: 2;
`;

export const DeleteComment = styled(DeleteButton)`
  color: ${colors.grey};
  font-size: 2.2em;
  display: ${props => (props.isHidden ? "none" : "block")};
`;

export const CommentAddSection = styled.div`
  padding: 1em;
  border-top: 1px solid ${colors.lightMediumGrey};
`;

export const EditButton = styled.button`
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
  display: ${props => (props.isHidden ? "none" : "block")};
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

export const FlexLabel = styled.div`
  font-size: 1em;
  align-items: center;
  height: 20px;
  overflow: hidden;
  white-space: nowrap;
  width: 180px;

  @media (max-width: 1700px) {
    width: 138px;
  }

  @media (max-width: 1500px) {
    width: 120px;
    font-size: 0.9em;
  }
  text-overflow: ellipsis;
`;

export const DateField = styled("span")`
  font-weight: normal;
  font-size: 0.8em;
  color: ${colors.grey};
`;

const CommentsPanel = props => {
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [activeCommentId, setActiveCommentId] = useState("");
  const [commentRef, setCommentRef] = useState();
  const firstRender = useRef(true);

  const [reply, setReply] = useState("");
  const [editReply, setEditReply] = useState("");
  const [activeReplyId, setActiveReplyId] = useState("");
  const [replyRef, setReplyRef] = useState();
  const [scrollRef, setScrollRef] = useState();
  const {
    match: {
      params: { pageId, introductionId, sectionId, confirmationId },
    },
    me: { id: myId },
  } = props;

  const parentId = pageId || sectionId || confirmationId || introductionId;
  const id = introductionId;

  let key;

  if (pageId) {
    key = "pageId";
  } else if (sectionId) {
    key = "sectionId";
  } else if (confirmationId) {
    key = "confirmationId";
  } else if (introductionId) {
    key = "introductionId";
  }

  console.log("key---------", key);
  console.log("parentId-----", parentId);
  console.log("confirmationId", confirmationId);

  const { loading, error, data } = useQuery(COMMENT_QUERY, {
    variables: {
      input: {
        [key]: parentId,
      },
      id,
    },
  });
  console.log("Comments Panel - data --------", data);

  const [createComment] = useMutation(COMMENT_ADD);
  const [deleteComment] = useMutation(COMMENT_DELETE);
  const [updateComment] = useMutation(COMMENT_UPDATE);
  const [createReply] = useMutation(REPLY_ADD);
  const [deleteReply] = useMutation(REPLY_DELETE);
  const [updateReply] = useMutation(REPLY_UPDATE);

  useSubscription(COMMENT_SUBSCRIPTION, {
    variables: {
      input: {
        [key]: parentId,
      },
    },
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!activeCommentId) {
      return;
    }
    commentRef.focus();
  }, [commentRef]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!activeReplyId) {
      return;
    }
    replyRef.focus();
  }, [replyRef]);

  useEffect(() => {
    if (!scrollRef) {
      return;
    }
    scrollRef.scrollIntoView({ behavior: "smooth" });
  }, [scrollRef]);

  const handleEdit = (id, commentText) => {
    setActiveCommentId(id);
    setEditComment(commentText);
    setActiveReplyId("");
  };

  const handleSubmit = event => {
    event.preventDefault();
    createComment({
      variables: {
        input: {
          [key]: parentId,
          commentText: comment,
        },
      },
    });
    setComment("");
    setActiveCommentId("");
    setActiveReplyId("");
  };

  const handleDelete = event => {
    const commentId = event.id;
    if (commentId && myId === event.user.id) {
      deleteComment({
        variables: {
          input: {
            [key]: parentId,
            commentId,
          },
        },
      });
    }
    setActiveCommentId("");
    setActiveReplyId("");
  };

  const handleSaveEdit = event => {
    const commentId = event.id;
    if (editComment) {
      updateComment({
        variables: {
          input: {
            [key]: parentId,
            commentId,
            commentText: editComment,
          },
        },
      });
      setActiveCommentId("");
      setActiveReplyId("");
    }
  };

  const handleReply = id => {
    setActiveReplyId(id);
  };

  const handleSaveReply = event => {
    const commentId = event.id;
    createReply({
      variables: {
        input: {
          [key]: parentId,
          commentId: commentId,
          commentText: reply,
        },
      },
    });
    setReply("");
    setActiveReplyId("");
  };

  const handleDeleteReply = (event, repliesItem) => {
    const commentId = event.id;
    const replyId = repliesItem.id;
    if (commentId && myId === repliesItem.user.id) {
      deleteReply({
        variables: {
          input: {
            [key]: parentId,
            commentId,
            replyId,
          },
        },
      });
    }
    setActiveCommentId("");
    setActiveReplyId("");
  };

  const handleEditReply = repliesItem => {
    setActiveReplyId(repliesItem.id);
    setEditReply(repliesItem.commentText);
    setActiveCommentId("");
  };

  const handleSaveEditReply = (event, repliesItem) => {
    const replyId = repliesItem.id;
    const commentId = event.id;
    if (myId === repliesItem.user.id) {
      updateReply({
        variables: {
          input: {
            [key]: parentId,
            commentId,
            replyId,
            commentText: editReply,
          },
        },
      });
      setReply("");
      setActiveReplyId("");
    }
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

  let comments;
  // if (input.sectionId) {
  //   comments = get(data, "section.comments", []);
  // } else if (input.pageId) {
  //   comments = get(data, "page.comments", []);
  // }
  switch (key) {
    case "pageId":
      comments = get(data, "page.comments", []);
      break;
    case "sectionId":
      comments = get(data, "section.comments", []);
      break;
    case "confirmationId":
      comments = get(data, "confirmationPage.comments", []);
      break;
    case "introductionId":
      comments = get(data, "questionnaireIntroduction.comments", []);
      break;
    default:
      comments = [];
      break;
  }
  const displayComments = comments.map((item, index) => {
    const replies = comments[index].replies;
    const displayReplies = replies.map((repliesItem, repliesIndex) => {
      return (
        <Replies
          key={repliesItem.id}
          repliesItem={repliesItem}
          myId={myId}
          getInitials={getInitials}
          handleEditReply={handleEditReply}
          index={index}
          repliesIndex={repliesIndex}
          handleDeleteReply={handleDeleteReply}
          item={item}
          activeReplyId={activeReplyId}
          setReplyRef={setReplyRef}
          setEditReply={setEditReply}
          editReply={editReply}
          handleSaveEditReply={handleSaveEditReply}
        />
      );
    });

    const repliesCount = displayReplies.length.toString();
    const setScroll = tag => {
      if (index === comments.length - 1) {
        setScrollRef(tag);
      }
    };
    return (
      <CommentSection
        setScroll={setScroll}
        key={item.id}
        myId={myId}
        getInitials={getInitials}
        index={index}
        item={item}
        activeCommentId={activeCommentId}
        setCommentRef={setCommentRef}
        editComment={editComment}
        setEditComment={setEditComment}
        displayReplies={displayReplies}
        repliesCount={repliesCount}
        replies={replies}
        setReply={setReply}
        setReplyRef={setReplyRef}
        reply={reply}
        activeReplyId={activeReplyId}
        handleSaveReply={handleSaveReply}
        handleReply={handleReply}
        handleSaveEdit={handleSaveEdit}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    );
  });

  return (
    <EditComment
      displayComments={displayComments}
      comment={comment}
      setComment={setComment}
      setActiveReplyId={setActiveReplyId}
      handleSubmit={handleSubmit}
    />
  );
};

CommentsPanel.propTypes = {
  match: CustomPropTypes.match.isRequired,
  me: CustomPropTypes.me.isRequired,
};

export default withMe(withRouter(CommentsPanel));
