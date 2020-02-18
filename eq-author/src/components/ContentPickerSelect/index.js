import React, { useState } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isNil } from "lodash";

import ContentPickerModal from "components/ContentPickerModal";
import Button from "components/buttons/Button";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import iconChevron from "components/ContentPickerSelect/icon-chevron.svg";

export const ContentSelectButton = styled(Button).attrs({
  variant: "tertiary",
})`
  font-size: 1em;
  font-weight: normal;
  padding: 0.5em 0.75em;
  border: 1px solid ${colors.borders};
  background-color: ${colors.white};
  height: 2.5em;
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
`;

export const ContentSelected = styled(Truncated)`
  color: ${colors.text};
  max-width: 18em;
  padding-right: 1em;
  text-align: left;
  line-height: 1.3;
`;

const ContentPickerSelect = props => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const {
    loading,
    error,
    disabled,
    answerData,
    metadataData,
    contentTypes,
    selectedId,
    selectedObj,
    name,
    selectedContentDisplayName,
    ...otherProps
  } = props;
  const isDisabled = loading || !isNil(error) || disabled;

  const handlePickerSubmit = selected => {
    setPickerOpen(false);
    props.onSubmit({ name, value: selected });
  };

  return (
    <>
      <ContentSelectButton
        data-test="content-picker-select"
        onClick={() => setPickerOpen(true)}
        disabled={isDisabled}
        {...otherProps}
      >
        <ContentSelected>{selectedContentDisplayName}</ContentSelected>
      </ContentSelectButton>
      <ContentPickerModal
        isOpen={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        onSubmit={handlePickerSubmit}
        answerData={answerData}
        metadataData={metadataData}
        contentTypes={contentTypes}
        selectedId={selectedId}
        selectedObj={selectedObj}
      />
    </>
  );
};

ContentPickerSelect.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object, // eslint-disable-line
  disabled: PropTypes.bool,
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire,
  }),
  selectedObj: PropTypes.shape({
    section: PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
    }),
    page: PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
    }),
    logical: PropTypes.string,
  }),
  selectedId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  selectedContentDisplayName: PropTypes.string,
  name: PropTypes.string.isRequired,
  contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  answerData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    })
  ),
  metadataData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    })
  ),
};

ContentPickerSelect.defaultProps = {
  selectedContentDisplayName: "Please select...",
};

export default ContentPickerSelect;
