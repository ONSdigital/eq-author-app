import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";

import { DATE } from "constants/answer-types";

import Collapsible from "components/Collapsible";
import { Select } from "components/Forms";

import MultiLineField from "../../MultiLineField";
import InlineField from "../../InlineField";
import { ToggleProperty, TextProperties } from "./";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const monthText = enableOn(["hub"]) ? "mm" : "Month";

const TextAreaProperties = ({ answer, page, value, onChange, getId }) => {
  const id = getId("textarea", answer.id);

  return (
    <Collapsible
      variant="content"
      title={`Text area properties`}
      withoutHideThis
    >
      <InlineField id="maxCharactersField" label={"Max characters"}>
        <TextProperties
          id="maxCharactersInput"
          key={`${answer.id}-max-length-input`}
          maxLength={answer.properties.maxLength}
          pageId={page.id}
          invalid={Boolean(errorCode)}
        />
      </InlineField>
      {lengthValueError(errorCode)}
    </Collapsible>
  );
};

TextAreaProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

export default TextAreaProperties;
