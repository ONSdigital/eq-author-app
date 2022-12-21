import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Input from "components-themed/Input";
import { Field, Label } from "components/Forms";
import { CONTENT_TYPE_LABELS } from "../ContentPickerSelectv3/content-types";

const StyledRadioInput = styled(Input)`
  position: relative;
  margin-right: 0.5em;
`;

const StyledLabel = styled(Label)`
  margin-top: 0.3em;
  margin-right: 2em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

const ContentTypeSelector = ({ contentType, contentTypes, setContentType }) => {
  return (
    <InlineField>
      {contentTypes.map((selectorContentType) => {
        return (
          <>
            <StyledRadioInput
              id={`content-type-selector-${selectorContentType}`}
              data-test={`content-type-selector-${selectorContentType}`}
              type="radio"
              checked={contentType === selectorContentType}
              onChange={() => setContentType(selectorContentType)}
            />
            <StyledLabel
              htmlFor={`content-type-selector-${selectorContentType}`}
              bold={false}
            >
              {CONTENT_TYPE_LABELS[selectorContentType]}
            </StyledLabel>
          </>
        );
      })}
    </InlineField>
  );
};

ContentTypeSelector.propTypes = {
  contentType: PropTypes.string,
  contentTypes: PropTypes.arrayOf(PropTypes.string),
  setContentType: PropTypes.func,
};

export default ContentTypeSelector;
