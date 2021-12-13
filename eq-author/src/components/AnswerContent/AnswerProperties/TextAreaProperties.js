import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { filter } from "lodash";
import { textAreaErrors } from "constants/validationMessages";
import { radius } from "constants/theme";
import Number, { NumberInput } from "components/Forms/Number";

import ValidationError from "components/ValidationError";
import Required from "components/AnswerContent/Required";
import InlineField from "components/AnswerContent/Format/InlineField";

const SmallNumber = styled(Number)`
  width: 7em;
  margin-left: 0;

  ${NumberInput} {
    border-radius: ${radius};
    padding: 0.25em 0.5em;
  }
`;

const TextAreaProperties = ({ answer, updateAnswer }) => {
  const errors = filter(answer.validationErrorInfo.errors, {
    field: "maxLength",
  });

  const [maxLength, setMaxLength] = useState(answer.properties.maxLength);
  useEffect(() => {
    setMaxLength(answer.properties.maxLength);
  }, [answer.properties.maxLength]);

  const onUpdateMaxLength = (value) => {
    const newValue = value === null ? 2000 : value;
    updateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, maxLength: newValue },
        },
      },
    });
    setMaxLength(newValue);
  };

  return (
    <>
      <InlineField id="maxCharactersField" label={"Max characters"}>
        <SmallNumber
          id="maxCharactersInput"
          answer={answer}
          name={answer.id}
          value={maxLength}
          onBlur={() => onUpdateMaxLength(maxLength)}
          onChange={({ value }) => setMaxLength(value)}
          max={2000}
          invalid={errors.length > 0}
          data-test="maxCharacterInput"
        />
      </InlineField>
      {errors.length > 0 && (
        <ValidationError>
          {textAreaErrors[errors[0].errorCode].message}
        </ValidationError>
      )}
      <Required answer={answer} updateAnswer={updateAnswer} />
    </>
  );
};

TextAreaProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default TextAreaProperties;
