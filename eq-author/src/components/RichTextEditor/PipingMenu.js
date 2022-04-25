import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ContentPicker from "components/ContentPickerv2";
import { useCurrentPageId } from "components/RouterContext";
import { useQuestionnaire } from "components/QuestionnaireContext";
import getContentBeforeEntity from "utils/getContentBeforeEntity";

import IconPiping from "components/RichTextEditor/icon-piping.svg?inline";
import IconPipingMetadata from "components/RichTextEditor/icon-piping-metadata.svg?inline";
import IconPipingVariable from "components/RichTextEditor/icon-piping-variable.svg?inline";
import ToolbarButton from "components/RichTextEditor/ToolbarButton";

import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelect/content-types";

export const MenuButton = styled(ToolbarButton)`
  height: 100%;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
`;

const PipingMenuPropTypes = {
  onItemChosen: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  canFocus: PropTypes.bool,
  allowableTypes: PropTypes.arrayOf(PropTypes.string),
};

const PipingMenu = ({
  onItemChosen,
  disabled,
  canFocus,
  allowableTypes = [ANSWER, METADATA],
}) => {
  const [pickerContent, setPickerContent] = useState(ANSWER);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { questionnaire } = useQuestionnaire();
  const pageId = useCurrentPageId();
  const handleButtonClick = (pickerContent) => {
    setPickerContent(pickerContent);
    setIsPickerOpen(true);
  };

  const handlePickerClose = () => setIsPickerOpen(false);

  const handlePickerSubmit = (...args) => {
    handlePickerClose();
    onItemChosen(...args);
  };

  const answerData = useMemo(
    () =>
      getContentBeforeEntity({
        questionnaire,
        preprocessAnswers: splitDateRangeAnswers,
        id: pageId,
      }),
    [questionnaire, pageId]
  );

  const metadataData = questionnaire?.metadata || [];

  return (
    <>
      {allowableTypes.includes(ANSWER) && (
        <MenuButton
          title="Pipe answer"
          disabled={disabled || !answerData.length}
          onClick={() => handleButtonClick(ANSWER)}
          canFocus={canFocus}
          data-test="piping-button"
        >
          <IconPiping />
        </MenuButton>
      )}
      {allowableTypes.includes(METADATA) && (
        <MenuButton
          title="Pipe metadata"
          disabled={disabled || !metadataData.length}
          onClick={() => handleButtonClick(METADATA)}
          canFocus={canFocus}
          modalVisible={isPickerOpen}
          data-test="piping-button-metadata"
        >
          <IconPipingMetadata />
        </MenuButton>
      )}
      {allowableTypes.includes(VARIABLES) && (
        <MenuButton
          title="Pipe variable"
          disabled={disabled}
          onClick={() => handleButtonClick(VARIABLES)}
          canFocus={canFocus}
          data-test="piping-button-variable"
        >
          <IconPipingVariable />
        </MenuButton>
      )}
      <ContentPicker
        isOpen={isPickerOpen}
        data={pickerContent === METADATA ? metadataData : answerData}
        startingSelectedAnswers={[]}
        onClose={handlePickerClose}
        onSubmit={handlePickerSubmit}
        data-test="picker"
        singleItemSelect
        contentType={pickerContent}
      />
    </>
  );
};

PipingMenu.propTypes = PipingMenuPropTypes;

export const splitDateRangeAnswers = (entity) =>
  entity.type === "DateRange"
    ? [
        {
          ...entity,
          id: `${entity.id}from`,
        },
        {
          ...entity,
          id: `${entity.id}to`,
          displayName: entity.secondaryLabel || entity.secondaryLabelDefault,
        },
      ]
    : entity;

export default PipingMenu;
