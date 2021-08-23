import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { characterErrors } from "constants/validationMessages";
import { colors } from "constants/theme";

import Collapsible from "components/Collapsible";
import ValidationError from "components/ValidationError";
import Required from "components/AdditionalContent/Required";
import InlineField from "components/AdditionalContent/AnswerProperties/Format/InlineField";
import { TextProperties } from "./";

const Container = styled.div`
  display: flex;
`;

const VerticalRule = styled.div`
  width: 1px;
  height: 2.5em;
  background-color: ${colors.grey};
  margin: 0 1.4em 0 0.5em;
`;

const TextAreaProperties = ({ answer, page, onChange, getId }) => {
  // const id = getId("textarea", answer.id);
  const errors = answer?.validationErrorInfo?.errors ?? [];

  const ERR_MAX_LENGTH_TOO_LARGE = "ERR_MAX_LENGTH_TOO_LARGE";
  const ERR_MAX_LENGTH_TOO_SMALL = "ERR_MAX_LENGTH_TOO_SMALL";

  const lengthErrors = {
    ERR_MAX_LENGTH_TOO_LARGE: {
      testId: "MaxCharacterTooBig",
      error: characterErrors.CHAR_LIMIT_2000_EXCEEDED,
    },
    ERR_MAX_LENGTH_TOO_SMALL: {
      testId: "MaxCharacterTooSmall",
      error: characterErrors.CHAR_MUST_EXCEED_9,
    },
  };

  const lengthValueError = (errorCode) => {
    if (!lengthErrors[errorCode]) {
      return null;
    }

    const { testId, error } = lengthErrors[errorCode];

    return <ValidationError test={testId}>{error}</ValidationError>;
  };

  const errorCode =
    errors
      .map(({ errorCode }) => errorCode)
      .find(
        (error) =>
          error === ERR_MAX_LENGTH_TOO_SMALL ||
          error === ERR_MAX_LENGTH_TOO_LARGE
      ) ?? false;

  return (
    <Collapsible
      variant="properties"
      title={`Text area properties`}
      withoutHideThis
      errorCount={errorCode ? 1 : 0}
    >
      <Container>
        <Required answer={answer} onChange={onChange} getId={getId} />
        <VerticalRule />
        <InlineField id="maxCharactersField" label={"Max characters"}>
          <TextProperties
            id="maxCharactersInput"
            key={`${answer.id}-max-length-input`}
            maxLength={answer.properties.maxLength}
            pageId={page.id}
            invalid={Boolean(errorCode)}
          />
        </InlineField>
      </Container>

      {lengthValueError(errorCode)}
    </Collapsible>
  );
};

TextAreaProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  onChange: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

export default TextAreaProperties;
