import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors, focusStyle } from "constants/theme";

import Button from "components/buttons/Button";

const Wrapper = styled.div`
  margin-bottom: 1em;
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

const AddComment = ({
  showCancel = false,
  onCancel,
  onAdd,
  commentId,
  className,
}) => {
  const [commentText, updateCommentText] = useState("");

  return (
    <Wrapper className={className}>
      <TextArea
        value={commentText}
        onChange={({ target: { value } }) => updateCommentText(value)}
      />
      <ButtonGroup>
        <Button
          type="submit"
          variant="greyed"
          small-medium
          disabled={commentText.length === 0}
          onClick={() => {
            onAdd(commentText, commentId);
            updateCommentText("");
          }}
        >
          Add
        </Button>
        {showCancel && (
          <Button variant="greyed" small-medium onClick={onCancel}>
            Cancel
          </Button>
        )}
      </ButtonGroup>
    </Wrapper>
  );
};

AddComment.propTypes = {
  /**
   * When true, the 'Cancel' button is shown.
   */
  showCancel: PropTypes.bool,
  /**
   * A function that runs when the cancel button is pressed. Required if 'showCancel' is true.
   */
  onCancel: PropTypes.func,
  /**
   * A function that runs when the 'Add' button is pressed.
   */
  onAdd: PropTypes.func.isRequired,
  /**
   * When true, the user is automatically focused on the textarea when it becomes visible.
   */
  autoFocus: PropTypes.bool,
  /**
   * If given, it is made available to the 'onAdd' function. Useful when adding replies to a root comment.
   */
  commentId: PropTypes.string,
  /**
   * Allows for CSS classes to be filtered down when using Styled-Components.
   */
  className: PropTypes.string,
};

export default AddComment;
