import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import { Label, Field } from "components/Forms";
import ScrollPane from "components/ScrollPane";
import Button from "components/buttons/Button";

import { StyledTextArea, CommentAddSection } from "./index";

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

const StyledLabel = styled(Label)`
  margin-bottom: 0;
`;

const StyledScrollPane = styled(ScrollPane)`
  height: auto;
`;

const EditComment = props => {
  const {
    displayComments,
    comment,
    setComment,
    setActiveReplyId,
    handleSubmit,
  } = props;

  return (
    <CommentsPane>
      <CommentAddSection>
        <Field>
          <StyledLabel>{"Comments"}</StyledLabel>
        </Field>
        <Field>
          <StyledTextArea
            id="comments-txt-area"
            name="comment"
            value={comment}
            minRows={4}
            maxRows={4}
            onChange={({ target }) => setComment(target.value)}
            onClick={() => setActiveReplyId("")}
            data-test="comment-txt-area"
          />
        </Field>
        <Button
          disabled={!comment}
          variant="primary"
          medium
          onClick={handleSubmit}
          data-test="btn-add-comment"
        >
          Add
        </Button>
      </CommentAddSection>
      <StyledScrollPane>{displayComments}</StyledScrollPane>
    </CommentsPane>
  );
};

EditComment.propTypes = {
  displayComments: PropTypes.instanceOf(Array).isRequired,
  comment: PropTypes.string.isRequired,
  setComment: PropTypes.func.isRequired,
  setActiveReplyId: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default EditComment;
