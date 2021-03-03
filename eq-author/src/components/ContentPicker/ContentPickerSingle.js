import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";

import PickerOption from "components/ContentPicker/PickerOption";
import ContentPickerTitle from "components/ContentPicker/ContentPickerTitle";
import ContentPickerPanel from "components/ContentPicker/ContentPickerPanel";

const openStyle = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;

export const PickerWrapper = styled.div`
  ${(props) => (props.open ? openStyle : null)};
  margin-bottom: 3px;
`;

const ContentPickerSingle = ({
  onTitleClick,
  onOptionClick,
  title,
  open,
  selected,
  disabled,
  hidden,
  data,
  selectedOption,
  childKey,
}) => {
  if (hidden) {
    return null;
  }

  return (
    <PickerWrapper open={open} data-test={`${title}-picker-wrapper`}>
      <ContentPickerTitle
        onClick={onTitleClick}
        selected={selected}
        open={open}
        disabled={disabled}
        data-test={`picker-title`}
      >
        {title}
      </ContentPickerTitle>
      <ContentPickerPanel
        id={`${title}-panel`}
        open={open}
        labelledBy={`${title}-title`}
      >
        {data.map((option) => {
          return (
            <PickerOption
              key={option.id}
              selected={selectedOption === option.id}
              onClick={() => onOptionClick(option)}
              disabled={childKey && (option[childKey] || []).length === 0}
              data-test="picker-option"
              aria-pressed={selectedOption === option.id}
            >
              {option.displayName}
            </PickerOption>
          );
        })}
      </ContentPickerPanel>
    </PickerWrapper>
  );
};

ContentPickerSingle.propTypes = {
  onTitleClick: PropTypes.func,
  onOptionClick: PropTypes.func,
  title: PropTypes.string,
  openAccordionId: PropTypes.number,
  selectedOption: PropTypes.string,
  open: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  childKey: PropTypes.string,
};

export default ContentPickerSingle;
