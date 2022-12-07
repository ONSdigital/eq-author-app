import React, { useState, useCallback } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isNil } from "lodash";

import { stripHtmlToText } from "utils/stripHTML";

import ContentPicker from "components/ContentPickerv2";
import Button from "components/buttons/Button";
import Truncated from "components/Truncated";
import Tooltip from "components/Forms/Tooltip";

import iconChevron from "components/ContentPickerSelect/icon-chevron.svg";

import { useTruncation } from "./useTruncation";

import { ANSWER, DYNAMIC_ANSWER } from "./content-types";
import { colors, focusStyle } from "constants/theme";

export const ContentSelectButton = styled(Button).attrs({
  variant: "tertiary",
})`
  padding: 0.5em 2em 0.5em 0.75em;
  font-size: 1em;
  font-weight: normal;
  border: ${({ hasError }) =>
    hasError
      ? `3px solid ${colors.errorPrimary}`
      : `1px solid ${colors.borders}`};
  background-color: ${colors.white};
  width: 100%;
  justify-content: space-between;

  &::after {
    content: url(${iconChevron});
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2em;
    height: 2em;
    margin: auto;
    opacity: 0.7;
  }

  &:hover {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    color: ${colors.blue};

    &::after {
      opacity: 1;
    }
  }

  &:focus {
    ${focusStyle}
  }
`;

export const ContentSelected = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  color: ${colors.text};
  padding-right: 2em;
  text-align: left;
  overflow: hidden;
`;

const ContentSelectedTitle = styled(Truncated)`
  font-weight: 600;
  line-height: 1.2em;
`;

const formatTitle = ({ page: { alias = "", title } = {} }) =>
  `${alias ? `${alias} -` : ""} ${stripHtmlToText(title)}`;

export const contentPickerSelectID = "content-picker-select";
export const contentPickerID = "content-picker";
export const defaultContentName = "Select an answer";
export const defaultMetadataName = "Select metadata";

const getContentView = (contentTypes, contentView) => {
  return contentTypes.find((contentType) => contentType === contentView);
};

const ContentPickerSelect = ({
  loading,
  error,
  disabled,
  answerData,
  metadataData,
  contentTypes,
  name,
  selectedContentDisplayName = defaultContentName,
  selectedMetadataDisplayName = defaultMetadataName,
  logic,
  contentView,
  setContentView,
  onSubmit,
  hasError,
  ...otherProps
}) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [isTruncated, elementToTruncate] = useTruncation();
  const [data, contentSelectButtonText] =
    getContentView(contentTypes, contentView) === ANSWER ||
    getContentView(contentTypes, contentView) === DYNAMIC_ANSWER
      ? [answerData, selectedContentDisplayName]
      : [metadataData, selectedMetadataDisplayName];

  const buildTitle = useCallback(
    (selectedContent) =>
      typeof selectedContent === "string" ? (
        selectedContent
      ) : (
        <>
          <ContentSelectedTitle ref={elementToTruncate}>
            {contentTypes[0] === DYNAMIC_ANSWER
              ? stripHtmlToText(selectedContent.questionTitle)
              : formatTitle(selectedContent)}
          </ContentSelectedTitle>
          <span>{`${selectedContent.displayName}`}</span>
        </>
      ),
    [elementToTruncate, contentTypes]
  );

  const handlePickerClose = (logic) => {
    if (logic) {
      setContentView(ANSWER);
      setPickerOpen(false);
    } else {
      setPickerOpen(false);
    }
  };

  const contentSelectButton = useCallback(
    () => (
      <ContentSelectButton
        data-test={contentPickerSelectID}
        onClick={() => setPickerOpen(true)}
        disabled={loading || !isNil(error) || disabled}
        hasError={hasError}
        {...otherProps}
      >
        <ContentSelected>{buildTitle(contentSelectButtonText)}</ContentSelected>
      </ContentSelectButton>
    ),
    [
      loading,
      contentSelectButtonText,
      error,
      disabled,
      hasError,
      buildTitle,
      otherProps,
    ]
  );

  const handlePickerSubmit = (selected) => {
    setContentView(ANSWER);
    setPickerOpen(false);
    onSubmit({ name, value: selected });
  };

  return (
    <>
      {isTruncated ? (
        <Tooltip
          content={
            contentSelectButtonText?.page
              ? formatTitle(contentSelectButtonText)
              : contentSelectButtonText
          }
          place="top"
          offset={{ top: 0, bottom: 10 }}
          event="mouseover"
          eventOff="mouseleave"
        >
          {contentSelectButton()}
        </Tooltip>
      ) : (
        contentSelectButton()
      )}

      <ContentPicker
        isOpen={isPickerOpen}
        data={data || []}
        startingSelectedAnswers={[]}
        onClose={() => handlePickerClose(logic)}
        onSubmit={handlePickerSubmit}
        data-test={contentPickerID}
        singleItemSelect
        logic={logic}
        contentType={getContentView(contentTypes, contentView)}
        setContentView={(contentView) => setContentView(contentView)}
      />
    </>
  );
};

const idAndName = {
  id: PropTypes.string,
  displayName: PropTypes.string,
};

ContentPickerSelect.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object, // eslint-disable-line
  disabled: PropTypes.bool,
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire,
  }),
  selectedObj: PropTypes.shape({
    section: PropTypes.shape(idAndName),
    page: PropTypes.shape(idAndName),
    logical: PropTypes.string,
  }),
  selectedId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  selectedContentDisplayName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  selectedMetadataDisplayName: PropTypes.string,
  name: PropTypes.string.isRequired,
  contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  answerData: PropTypes.arrayOf(PropTypes.shape(idAndName)),
  metadataData: PropTypes.arrayOf(PropTypes.shape(idAndName)),
  hasError: PropTypes.bool,
};

export default ContentPickerSelect;
