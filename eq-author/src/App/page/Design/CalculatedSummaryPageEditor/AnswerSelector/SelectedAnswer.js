import React, { useState } from "react";
import PropType from "prop-types";
import styled from "styled-components";

import { colors, focusStyle } from "constants/theme";

import Truncated from "components/Truncated";
import { MenuItemType } from "components/ContentPickerv3/Menu";
import Modal from "components-themed/Modal";

import { ReactComponent as IconClose } from "assets/icon-close.svg";
import {
  DELETE_BUTTON_TEXT,
  DELETE_CALC_SUM_ANSWER_TITLE,
} from "constants/modal-content";

const Wrapper = styled.div`
  background: ${colors.primary};
  color: ${colors.white};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  margin-bottom: 0.5em;
`;

const Title = styled(Truncated)`
  padding: 0.3em 0 0.3em 0.5em;
  line-height: 1.3;
`;

const Chip = styled(MenuItemType)`
  color: ${colors.text};
  float: right;
  font-size: 0.8em;
`;

const CloseButton = styled.button`
  background: transparent;
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;

  svg {
    width: 2em;
    height: 2em;
    vertical-align: middle;
  }

  svg {
    g,
    path,
    polygon {
      fill: ${colors.white};
    }
  }

  &:hover {
    svg {
      g,
      path,
      polygon {
        fill: ${colors.highlightBlue};
      }
    }
  }

  &:focus {
    ${focusStyle}
  }
`;

const SelectedAnswer = ({
  displayName,
  properties,
  type: answerType,
  folderType,
  onRemove,
}) => {
  const unitType = properties.unit || false;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Modal
        title={DELETE_CALC_SUM_ANSWER_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={onRemove}
        onClose={() => setShowDeleteModal(false)}
      />
      <Wrapper>
        <Title>{displayName}</Title>
        {unitType && <Chip data-test="unit-type">{unitType}</Chip>}
        {folderType === "ListCollectorFolder" && (
          <Chip>List collector follow-up</Chip>
        )}
        <Chip>{answerType}</Chip>
        <CloseButton
          data-test="remove-answer-button"
          onClick={() => setShowDeleteModal(true)}
        >
          <IconClose />
        </CloseButton>
      </Wrapper>
    </>
  );
};

SelectedAnswer.propTypes = {
  onRemove: PropType.func.isRequired,
  displayName: PropType.string.isRequired,
  type: PropType.string.isRequired,
  folderType: PropType.string,
  properties: PropType.object.isRequired, // eslint-disable-line
};

export default SelectedAnswer;
