import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";
import CollapsibleToggled from "components/CollapsibleToggled";
import InlineField from "components/AnswerContent/Format/InlineField";
import { filter } from "lodash";
import Number from "components/Forms/Number";

const TextFieldProperties = ({
  answer,
  updateAnswer,
  hasMutuallyExclusiveAnswer,
}) => {
  const errors = filter(answer.validationErrorInfo.errors, {
    field: "maxLength",
  });
  const [maxLength, setMaxLength] = useState(answer.properties.maxLength);
  useEffect(() => {
    setMaxLength(answer.properties.maxLength);
  }, [answer.properties.maxLength]);

  const onUpdateMaxLength = (value) => {
    const newValue = value === null ? null : value;
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
        withContentSpace
        onChange={({ value }) =>
          updateAnswer({
            variables: {
              input: { id: answer.id, limitCharacter: value },
            },
          })
        }
        isOpen={answer.limitCharacter}
      />
      {answer.limitCharacter && (
        <InlineField
          id="maxCharactersLimit"
          label={"Maximum number of characters"}
        >
          <Number
            id="maxCharactersInput"
            answer={answer}
            name={answer.id}
            value={maxLength}
            onBlur={() => onUpdateMaxLength(maxLength)}
            onChange={({ value }) => setMaxLength(value)}
            max={200}
            invalid={errors.length > 0}
            data-test="maxCharacterInput"
          />
        </InlineField>
      )}

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
