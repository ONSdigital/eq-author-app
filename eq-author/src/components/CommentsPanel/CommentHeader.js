import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import "moment/locale/en-gb";

import {
  CommentHeaderContainer,
  AvatarWrapper,
  AvatarOuter,
  AvatarInner,
  NameWrapper,
  DateField,
  EditButton,
  DeleteComment,
  ToolTipWrapper,
} from "./index";

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

const FlexLabelReplies = styled(FlexLabel)`
  @media (max-width: 1700px) {
    width: 107px;
  }
`;

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
        <NameWrapper>
          <FlexLabelReplies>{shared.user.displayName}</FlexLabelReplies>
          <DateField>{moment(shared.createdTime).calendar()}</DateField>
        </NameWrapper>
        <ToolTipWrapper content={"Edit"}>
          <EditButton
            isHidden={shared.user.id !== myId}
            onClick={() =>
              repliesItem
                ? handleEdit(repliesItem)
                : handleEdit(shared.id, shared.commentText)
            }
            data-test={`btn-edit-${index}${
              repliesIndex ? `-${repliesIndex}` : ""
            }`}
          />
        </ToolTipWrapper>
        <ToolTipWrapper content={"Delete"}>
          <DeleteComment
            isHidden={shared.user.id !== myId}
            onClick={() => handleDelete(item, repliesItem)}
            data-test={`btn-delete-${index}${
              repliesIndex ? `-${repliesIndex}` : ""
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
  // don't forget to do this
  repliesItem: PropTypes.object,
  shared: PropTypes.object,
  item: PropTypes.object,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CommentHeader;
