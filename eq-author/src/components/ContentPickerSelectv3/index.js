import React, { useState, useCallback, useEffect } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isNil, some } from "lodash";

import { stripHtmlToText } from "utils/stripHTML";

import ContentPicker from "components/ContentPickerv3";
import Button from "components/buttons/Button";
import Truncated from "components/Truncated";
import Tooltip from "components/Forms/Tooltip";

import iconChevron from "components/ContentPickerSelect/icon-chevron.svg";

import { useTruncation } from "./useTruncation";

import { ANSWER, DYNAMIC_ANSWER, CONTENT_TYPE_FIELDS } from "./content-types";
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

const ContentPickerSelect = ({
  loading,
  error,
  disabled,
  data,
  contentTypes,
  selectedContentDisplayName = defaultContentName,
  selectedId,
  onSubmit,
  hasError,
  contentPickerTitle,
  ...otherProps
}) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [isTruncated, elementToTruncate] = useTruncation();
  const [contentType, setContentType] = useState(contentTypes[0] || ANSWER);

  useEffect(() => {
    contentTypes.forEach((contentType) => {
      if (some(data[contentType], { id: selectedId })) {
        setContentType(contentType);
      }
    });
  }, [contentTypes, data, selectedId]);

  const buildTitle = useCallback(
    (selectedContent) => {
      if (typeof selectedContent === "string") {
        return selectedContent;
      }
      if (selectedContent.__typename === "Metadata") {
        return (
          <>
            <ContentSelectedTitle ref={elementToTruncate}>
              {selectedContent.key}
            </ContentSelectedTitle>
            <span>{`${selectedContent.displayName}`}</span>
          </>
        );
      }
      return (
        <>
          <ContentSelectedTitle ref={elementToTruncate}>
            {contentTypes[0] === DYNAMIC_ANSWER
              ? stripHtmlToText(selectedContent.questionTitle)
              : formatTitle(selectedContent)}
          </ContentSelectedTitle>
          <span>{`${selectedContent.displayName}`}</span>
        </>
      );
    },
    [elementToTruncate, contentTypes]
  );

  const handlePickerClose = () => {
    setPickerOpen(false);
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
        <ContentSelected>
          {buildTitle(selectedContentDisplayName)}
        </ContentSelected>
      </ContentSelectButton>
    ),
    [
      loading,
      selectedContentDisplayName,
      error,
      disabled,
      hasError,
      buildTitle,
      otherProps,
    ]
  );

  const handlePickerSubmit = (selected) => {
    setPickerOpen(false);
    onSubmit({ name: CONTENT_TYPE_FIELDS[contentType], value: selected });
  };

  return (
    <>
      {isTruncated ? (
        <Tooltip
          content={
            selectedContentDisplayName?.page
              ? formatTitle(selectedContentDisplayName)
              : selectedContentDisplayName
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
        contentType={contentType}
        contentTypes={contentTypes}
        setContentType={setContentType}
        data={data[contentType] || []}
        startingSelectedAnswers={selectedId ? [{ id: selectedId }] : []}
        onClose={handlePickerClose}
        onSubmit={handlePickerSubmit}
        data-test={contentPickerID}
        singleItemSelect
        contentPickerTitle={contentPickerTitle}
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
  contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasError: PropTypes.bool,
  contentPickerTitle: PropTypes.string,
};

export default ContentPickerSelect;
