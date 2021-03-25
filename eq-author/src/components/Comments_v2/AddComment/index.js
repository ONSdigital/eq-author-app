import React from "react";
import styled from "styled-components";

import { colors, focusStyle } from "constants/theme";

import Button from "components/buttons/Button";

export default ({
  cancel,
  onCancel,
  onAdd,
  autoFocus,
  commentId,
  className,
}) => {
  const Wrapper = styled.form`
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

  return (
    <Wrapper
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        let commentText = e.target.newComment.value;
        onAdd(commentText, commentId);
        commentText = "";
      }}
    >
      <TextArea autoFocus={autoFocus} id="newComment" required />
      <ButtonGroup>
        <Button type="submit" variant="greyed" small-medium>
          Add
        </Button>
        {cancel && (
          <Button variant="greyed" small-medium onClick={onCancel}>
            Cancel
          </Button>
        )}
      </ButtonGroup>
    </Wrapper>
  );
};
