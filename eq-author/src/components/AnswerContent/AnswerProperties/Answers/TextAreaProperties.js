import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { characterErrors } from "constants/validationMessages";
import { radius, colors } from "constants/theme";
import Number, { NumberInput } from "components/Forms/Number";

import ValidationError from "components/ValidationError";
import Required from "components/AdditionalContent/Required";
import InlineField from "components/AdditionalContent/AnswerProperties/Format/InlineField";

const SmallNumber = styled(Number)`
  width: 7em;
  margin-left: 0em;

  ${NumberInput} {
    ${(props) =>
      props.invalid &&
      css`
        border-color: ${colors.errorPrimary};
        &:focus,
        &:focus-within {
          border-color: ${colors.errorPrimary};
          outline-color: ${colors.errorPrimary};
          box-shadow: 0 0 0 2px ${colors.errorPrimary};
        }
        &:hover {
          border-color: ${colors.errorPrimary};
          outline-color: ${colors.errorPrimary};
        }
      `}
    border-radius: ${radius};
    padding: 0.25em 0.5em;
  }
`;
const Container = styled.div`
  display: flex;
`;

const TextAreaProperties = ({ answer, updateAnswer }) => {
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

  const [maxLength, setMaxLength] = useState(answer.properties.maxLength);
  useEffect(() => {
    setMaxLength(answer.properties.maxLength);
  }, [answer.properties.maxLength]);

  const onUpdateMaxLength = (value) => {
    updateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, maxLength: value },
        },
      },
    });
  };

  return (
    <>
      <Container>
        <InlineField id="maxCharactersField" label={"Max characters"}>
          <SmallNumber
            id="maxCharactersInput"
            answer={answer}
            name={answer.id}
            value={maxLength}
            onBlur={() => onUpdateMaxLength(maxLength)}
            onChange={({ value }) => setMaxLength(value)}
            max={2000}
            invalid={Boolean(errorCode)}
          />
        </InlineField>
      </Container>
      {lengthValueError(errorCode)}
      <Container>
        <Required answer={answer} updateAnswer={updateAnswer} />
      </Container>
    </>
  );
};

TextAreaProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default TextAreaProperties;
