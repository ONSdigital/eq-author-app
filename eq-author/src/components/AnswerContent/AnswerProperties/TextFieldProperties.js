import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Required from "components/AnswerContent/Required";
import InlineField from "components/AnswerContent/Format/InlineField";
import CollapsibleToggled from "components/CollapsibleToggled";
import Number, { NumberInput } from "components/Forms/Number";
import ValidationError from "components/ValidationError";

import { radius } from "constants/theme";
import { textFieldErrors } from "constants/validationMessages";

const SmallNumber = styled(Number)`
  width: 7em;
  margin-left: 0;

  ${NumberInput} {
    border-radius: ${radius};
    padding: 0.25em 0.5em;
  }
`;

const TextFieldProperties = ({
  answer,
  updateAnswer,
  hasMutuallyExclusiveAnswer,
}) => {
  const [maxLength, setMaxLength] = useState(answer.properties.maxLength);
  useEffect(() => {
    setMaxLength(answer.properties.maxLength);
  }, [answer.properties.maxLength]);

  const errors = answer.validationErrorInfo.errors.filter(
    (error) => error.field === "maxLength"
  );

  const onUpdateMaxLength = (value) => {
    const newValue = value === null ? 100 : value;
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
      <CollapsibleToggled
        id="character-length"
        title="Character limit"
        quoted={false}
        onChange={({ value }) =>
          updateAnswer({
            variables: {
              input: { id: answer.id, limitCharacter: value },
            },
          })
        }
        isOpen={answer.limitCharacter}
      >
        <InlineField
          id="maxCharactersLimit"
          label={"Maximum number of characters"}
        >
          <SmallNumber
            id="limitCharactersInput"
            answer={answer}
            name={answer.id}
            value={maxLength}
            onBlur={() => onUpdateMaxLength(maxLength)}
            onChange={({ value }) => setMaxLength(value)}
            data-test="limitCharacterInput"
          />
        </InlineField>
        {errors.length > 0 && (
          <ValidationError>
            {textFieldErrors[errors[0].errorCode].message}
          </ValidationError>
        )}
      </CollapsibleToggled>

      <Required
        answer={answer}
        updateAnswer={updateAnswer}
        hasMutuallyExclusiveAnswer={hasMutuallyExclusiveAnswer}
      />
    </>
  );
};

TextFieldProperties.propTypes = {
  updateAnswer: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
  hasMutuallyExclusiveAnswer: PropTypes.bool,
  limitCharacter: PropTypes.bool,
};

export default TextFieldProperties;
