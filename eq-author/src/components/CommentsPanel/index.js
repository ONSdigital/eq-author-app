import React, { useState } from "react";
import { withRouter } from "react-router";
import { get } from "lodash";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loading from "components/Loading";
import Error from "components/Error";
import CustomPropTypes from "custom-prop-types";

import COMMENT_QUERY from "./commentsQuery.graphql";
import COMMENT_ADD from "./createNewComment.graphql";

import styled from "styled-components";
import ScrollPane from "components/ScrollPane";
import { colors } from "constants/theme";

import TextArea from "components/Forms/TextArea";
import { Field, Label } from "components/Forms";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";

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
  padding: 0.7em 1em;
  border-bottom: 1px solid ${colors.lightMediumGrey};
`;

const ShowComment = styled.div`
  padding: 0.5em 1em;
  margin-bottom: 5px;
  border: 1px solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  word-break: break-word;
`;

const CommentHeaderContainer = styled(Field)`
  display: flex;
  justify-content: flex-start;
  -webkit-align-items: start;
  padding: 0;
  margin: 0;
  margin-bottom: 8px;
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

const FlexLabel = styled.div`
  font-size: 1.1em;
  align-items: center;
  height: 22px;
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
}) => {
  const [comment, setComment] = useState("");
  const { loading, error, data } = useQuery(COMMENT_QUERY, {
    variables: {
      input: { pageId },
    },
  });

  const [createComment] = useMutation(COMMENT_ADD);

  const handleChange = event => {
    setComment(event.target.value);
  };

  const handleSubmit = event => {
    if (comment) {
      createComment({
        variables: {
          input: {
            pageId,
            commentText: comment,
          },
        },
      });
      setComment("");
    }
    event.preventDefault();
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

  const commentsArray = get(data, "page.comments", []);

  return (
    <CommentsPane>
      <ScrollPane>
        <CommentSection>
          <Field>
            <Label>{"Comments"}</Label>
            <TextArea
              id="comments-txt-area"
              name="textArea"
              data-test="comment-txt-area"
              value={comment}
              onChange={handleChange}
            />
          </Field>
          <ButtonGroup horizontal align="right">
            <Button
              disabled={!comment}
              onClick={handleSubmit}
              variant="primary"
              data-test="btn-add-comment"
            >
              Add
            </Button>
          </ButtonGroup>
        </CommentSection>

        {commentsArray.map(item => (
          <CommentSection key={item.id}>
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
            </CommentHeaderContainer>
            <ShowComment>{item.commentText}</ShowComment>
          </CommentSection>
        ))}
      </ScrollPane>
    </CommentsPane>
  );
};

CommentsPanel.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default withRouter(CommentsPanel);
