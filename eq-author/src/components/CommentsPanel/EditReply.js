import React from "react";
import PropTypes from "prop-types";
import { Reply, StyledTextArea, CommentFooterContainer } from ".";
import Button from "components/buttons/Button";

const EditReply = (props) => {
  const {
    replyCount,
    item,
    setReplyRef,
    setReply,
    reply,
    index,
    handleSaveReply,
    setActiveReplyId,
  } = props;

  const handleCancel = () => {
    setReply("");
    setActiveReplyId("");
  };

  return (
    <Reply indent={replyCount}>
      <StyledTextArea
        id={`reply-${item.id}`}
        inputRef={(tag) => {
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
        <Button
          id={`btn-save-reply-${index}`}
          disabled={!reply}
          btn-save-reply
          variant="greyed"
          small-medium
          onClick={() => handleSaveReply(item)}
          data-test={`btn-save-reply-${index}`}
        >
          Add
        </Button>
        <Button
          id={`btn-cancel-reply-${index}`}
          btn-save-reply
          variant="greyed"
          small-medium
          onClick={() => handleCancel()}
          data-test={`btn-cancel-reply-${index}`}
        >
          Cancel
        </Button>
      </CommentFooterContainer>
    </Reply>
  );
};

EditReply.propTypes = {
  replyCount: PropTypes.number.isRequired,
  item: PropTypes.instanceOf(Object),
  setReplyRef: PropTypes.func.isRequired,
  setReply: PropTypes.func.isRequired,
  reply: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleSaveReply: PropTypes.func.isRequired,
  setActiveReplyId: PropTypes.func.isRequired,
};

export default EditReply;
