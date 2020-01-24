import React from "react";
import PropTypes from "prop-types";
import { Reply, StyledTextArea, CommentFooterContainer, SaveButton } from ".";

const EditReply = props => {
  const {
    replies,
    item,
    setReplyRef,
    setReply,
    reply,
    index,
    handleSaveReply,
  } = props;
  return (
    <Reply indent={replies.length}>
      <StyledTextArea
        id={`reply-${item.id}`}
        inputRef={tag => {
          setReplyRef(tag);
        }}
        value={reply}
        minRows={4}
        maxRows={4}
        type="text"
        onChange={({ target }) => setReply(target.value)}
        data-test={`reply-txtArea-${index}`}
      />
      <CommentFooterContainer>
        <SaveButton
          id={index}
          disabled={!reply}
          btn-save-reply
          medium
          onClick={() => handleSaveReply(item)}
          data-test={`btn-save-reply-${index}`}
        >
          Save
        </SaveButton>
      </CommentFooterContainer>
    </Reply>
  );
};

EditReply.propTypes = {
  replies: PropTypes.instanceOf(Array),
  item: PropTypes.instanceOf(Object),
  setReplyRef: PropTypes.func.isRequired,
  setReply: PropTypes.func.isRequired,
  reply: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleSaveReply: PropTypes.func.isRequired,
};

export default EditReply;
