import React, { useState } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

import { colors, focusStyle } from "constants/theme";

import Button from "components/buttons/Button";
import TextareaAutosize from "react-textarea-autosize";

const Wrapper = styled.div`
  margin-bottom: 1em;
`;

const TextAreaStyle = css`
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

const TextAreaFixedSize = styled.textarea`
  height: 94px;
  ${TextAreaStyle}
`;

const TextAreaGrowable = styled(TextareaAutosize)`
  width: 100%;
  ${TextAreaStyle}
`;

const ButtonGroup = styled.div`
  display: flex;

  button {
    margin-right: 0.5em;
  }
`;

const CommentEditor = ({
  confirmText = "Add",
  cancelText = "Cancel",
  variant = "fixed",
  initialValue = "",
  showCancel = false,
  onCancel,
  onConfirm,
  className,
}) => {
  const [commentText, updateCommentText] = useState(initialValue);

  return (
    <Wrapper className={className} data-test="CommentEditor">
      {variant === "fixed" && (
        <TextAreaFixedSize
          data-test="CommentEditor__Input"
          value={commentText}
          onChange={({ target: { value } }) => updateCommentText(value)}
        />
      )}
      {variant === "growable" && (
        <TextAreaGrowable
          data-test="CommentEditor__Input"
          value={commentText}
          onChange={({ target: { value } }) => updateCommentText(value)}
        />
      )}
      <ButtonGroup>
        <Button
          data-test="CommentEditor__ConfirmBtn"
          type="submit"
          variant="greyed"
          small-medium
          disabled={commentText.length === 0}
          onClick={() => {
            onConfirm(commentText);
            updateCommentText("");
          }}
        >
          {confirmText}
        </Button>
        {showCancel && (
          <Button
            data-test="CommentEditor__CancelBtn"
            variant="greyed"
            small-medium
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        )}
      </ButtonGroup>
    </Wrapper>
  );
};

CommentEditor.propTypes = {
  /**
   * The text to show on the confirm button.
   */
  confirmText: PropTypes.string,
  /**
   * The text to show on the cancel button.
   */
  cancelText: PropTypes.string,
  /**
   * The value to show in the input box when it is first rendered.
   */
  initialValue: PropTypes.string,
  /**
   * The style of the input box.
   */
  variant: PropTypes.oneOf(["fixed", "growable"]),
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
  onConfirm: PropTypes.func.isRequired,
  /**
   * Allows for CSS classes to be filtered down when using Styled-Components.
   */
  className: PropTypes.string,
};

export default CommentEditor;
