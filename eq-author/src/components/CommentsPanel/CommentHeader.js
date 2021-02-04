import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/en-gb";

import {
  CommentHeaderContainer,
  AvatarWrapper,
  AvatarOuter,
  AvatarInner,
  CommentMetadata,
  DatePosted,
  EditButton,
  DeleteComment,
  ToolTipWrapper,
  Author,
} from "./index";

const CommentHeader = props => {
  const {
    myId,
    getInitials,
    index,
    repliesIndex,
    repliesItem,
    shared,
    item,
    handleEdit,
    handleDelete,
  } = props;

  return (
    <>
      <CommentHeaderContainer>
        <AvatarWrapper>
          <AvatarOuter avatarColor={shared.user.id === myId}>
            <AvatarInner>{getInitials(shared.user.name)}</AvatarInner>
          </AvatarOuter>
        </AvatarWrapper>
        <CommentMetadata>
          <Author>{shared.user.displayName}</Author>
          <DatePosted>{moment(shared.createdTime).calendar()}</DatePosted>
        </CommentMetadata>
        <ToolTipWrapper content={"Edit"}>
          <EditButton
            isHidden={shared.user.id !== myId}
            onClick={() =>
              repliesItem
                ? handleEdit(repliesItem)
                : handleEdit(shared.id, shared.commentText)
            }
            data-test={`btn-edit-${index}${
              repliesIndex >= 0 ? `-${repliesIndex}` : ""
            }`}
          />
        </ToolTipWrapper>
        <ToolTipWrapper content={"Delete"}>
          <DeleteComment
            isHidden={shared.user.id !== myId}
            onClick={() => handleDelete(item, repliesItem)}
            data-test={`btn-delete-${index}${
              repliesIndex >= 0 ? `-${repliesIndex}` : ""
            }`}
          />
        </ToolTipWrapper>
      </CommentHeaderContainer>
    </>
  );
};

CommentHeader.propTypes = {
  myId: PropTypes.string.isRequired,
  getInitials: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  repliesIndex: PropTypes.number,
  repliesItem: PropTypes.instanceOf(Object),
  shared: PropTypes.instanceOf(Object).isRequired,
  item: PropTypes.instanceOf(Object).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CommentHeader;
