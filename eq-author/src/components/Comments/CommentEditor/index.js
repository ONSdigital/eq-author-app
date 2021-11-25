import React, { useState, useEffect, useRef } from "react";
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

    &:focus {
      ${focusStyle}
      outline: none;
    }
  }
`;

const OpenEditorBtn = styled(Button).attrs({ "small-medium": true })`
  margin-bottom: 0.5em;

  &:focus {
    ${focusStyle}
    outline: none;
  }
`;

const CommentEditor = ({
  confirmText = "Add",
  cancelText = "Cancel",
  variant = "fixed",
  initialValue = "",
  canClose = false,
  startClosed = false,
  openEditorBtnText = "Reply",
  onCancel,
  onConfirm,
  className,
}) => {
  const [editorVisible, showEditor] = useState(true);
  const [commentText, updateCommentText] = useState("");
  const [commentOpen, setCommentOpen] = useState(false);
  const textInput = useRef(null);

  useEffect(() => {
    if (canClose) {
      showEditor(!startClosed);
      setCommentOpen(true);
    }
  }, [canClose, startClosed]);

  useEffect(() => {
    if (initialValue) {
      updateCommentText(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (canClose && editorVisible && commentOpen) {
      textInput.current.focus();
    }
  }, [editorVisible, canClose, commentOpen]);

  if (editorVisible) {
    return (
      <Wrapper className={className} data-test="CommentEditor">
        {variant === "fixed" && (
          <TextAreaFixedSize
            data-test="CommentEditor__Input"
            ref={textInput}
            value={commentText}
            onChange={({ target: { value } }) => updateCommentText(value)}
          />
        )}
        {variant === "growable" && (
          <TextAreaGrowable
            data-test="CommentEditor__Input"
            ref={textInput}
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
            disabled={commentText.trim().length === 0}
            onClick={() => {
              onConfirm(commentText.trim());
              updateCommentText("");
              if (canClose) {
                showEditor(false);
              }
            }}
          >
            {confirmText}
          </Button>
          {canClose && (
            <Button
              data-test="CommentEditor__CancelBtn"
              variant="greyed"
              small-medium
              onClick={() => {
                showEditor(false);
                if (onCancel) {
                  onCancel();
                }
              }}
            >
              {cancelText}
            </Button>
          )}
        </ButtonGroup>
      </Wrapper>
    );
  } else {
    return (
      <OpenEditorBtn onClick={() => showEditor(true)}>
        {openEditorBtnText}
      </OpenEditorBtn>
    );
  }
};

CommentEditor.propTypes = {
  /**
   * The text to show on the confirm button.
   */
  confirmText: PropTypes.string,
  /**
   * The text to show on the cancel (close) button.
   */
  cancelText: PropTypes.string,
  /**
   * The style of input box to show.
   */
  variant: PropTypes.string,
  /**
   * The initial content to show in the input box.
   */
  initialValue: PropTypes.string,
  /**
   * When true, the cancel button is enabled and, when it is
   * pressed, the editor will close and instead show a button to
   * open it again.
   */
  canClose: PropTypes.bool,
  /**
   * When true, the editor will first show the button to open
   * it instead of the form itself.
   */
  startClosed: PropTypes.bool,
  /**
   * Text to show on the button that opens the editor.
   */
  openEditorBtnText: PropTypes.string,
  /**
   * A custom function that is ran when the close button is pressed.
   */
  onCancel: PropTypes.func,
  /**
   * A custom function to run when the confirm button is pressed.
   */
  onConfirm: PropTypes.func.isRequired,
  /**
   * Enables restyling the component.
   */
  className: PropTypes.string,
};

export default CommentEditor;
