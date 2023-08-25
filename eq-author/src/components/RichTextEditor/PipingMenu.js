import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { find, some } from "lodash";

import ContentPicker from "components/ContentPickerv3";
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
  LIST_ANSWER,
  SUPPLEMENTARY_DATA,
} from "components/ContentPickerSelectv3/content-types";

export const MenuButton = styled(ToolbarButton)`
  height: 100%;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
`;

const PipingMenuPropTypes = {
  pageType: PropTypes.string,
  onItemChosen: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  canFocus: PropTypes.bool,
  allowableTypes: PropTypes.arrayOf(PropTypes.string),
  allCalculatedSummaryPages: PropTypes.array, //eslint-disable-line
  listId: PropTypes.string,
  supplementaryDataId: PropTypes.string,
};

const PipingMenu = ({
  pageType,
  onItemChosen,
  disabled,
  canFocus,
  allowableTypes = [ANSWER, METADATA],
  allCalculatedSummaryPages = [], // Default array is empty to disable variable piping button
  listId,
}) => {
  const [pickerContent, setPickerContent] = useState(ANSWER);
  const [contentTypes, setContentTypes] = useState([ANSWER]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { questionnaire } = useQuestionnaire();
  const pageId = useCurrentPageId();

  const handleButtonClick = (pickerContent) => {
    setPickerContent(pickerContent);
    const tempContentTypes = [pickerContent];
    if (pickerContent === ANSWER) {
      if (some(questionnaire?.collectionLists?.lists, { id: listId })) {
        tempContentTypes.push(LIST_ANSWER);
      }
    }
    if (pickerContent === METADATA) {
      if (questionnaire.supplementaryData) {
        tempContentTypes.push(SUPPLEMENTARY_DATA);
      }
    }
    setContentTypes(tempContentTypes);
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

  const listAnswers =
    find(questionnaire?.collectionLists?.lists, { id: listId })?.answers || [];

  const supplementaryData =
    questionnaire?.supplementaryData?.data
      .filter((list) => list.listName === "" || list.id === listId)
      .flatMap((list) => {
        return list.schemaFields.map((schemaField) => {
          return {
            listName: list.listName,
            ...schemaField,
          };
        });
      }) || [];

  const handlePickerContent = (contentType) => {
    switch (contentType) {
      case METADATA:
        return metadataData;
      case ANSWER:
        return answerData;
      case VARIABLES:
        return allCalculatedSummaryPages;
      case LIST_ANSWER:
        return listAnswers;
      case SUPPLEMENTARY_DATA:
        return supplementaryData;
      default:
        return answerData;
    }
  };

  return (
    <>
      {allowableTypes.includes(ANSWER) && (
        <MenuButton
          title="Pipe answer"
          disabled={
            disabled ||
            (!answerData.length && !listId && !supplementaryData.length)
          }
          onClick={() => handleButtonClick(ANSWER)}
          canFocus={canFocus}
          modalVisible={isPickerOpen}
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
          disabled={
            disabled ||
            (pageType !== "CalculatedSummaryPage" &&
              !allCalculatedSummaryPages[0]?.summaryAnswers.length)
          }
          onClick={() => handleButtonClick(VARIABLES)}
          canFocus={canFocus}
          modalVisible={isPickerOpen}
          data-test="piping-button-variable"
        >
          <IconPipingVariable />
        </MenuButton>
      )}
      <ContentPicker
        pageType={pageType}
        isOpen={isPickerOpen}
        data={handlePickerContent(pickerContent)}
        startingSelectedAnswers={[]}
        onClose={handlePickerClose}
        onSubmit={handlePickerSubmit}
        data-test="picker"
        singleItemSelect
        contentType={pickerContent}
        contentTypes={contentTypes}
        setContentType={setPickerContent}
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
