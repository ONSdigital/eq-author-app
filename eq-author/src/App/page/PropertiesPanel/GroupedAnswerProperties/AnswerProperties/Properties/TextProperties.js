import React, { useState } from "react";
import { Input } from "components/Forms";
import styled from "styled-components";
import UPDATE_ANSWERS_OF_TYPE from "./updateAnswersOfTypeMutation.graphql";
import { useMutation } from "@apollo/react-hooks";
import { colors } from "constants/theme";
import PropTypes from "prop-types";

const MaxCharacters = styled(Input)`
  width: 5em;
  border-color: ${(props) => (props.invalid ? colors.red : "")};
  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    appearance: none;
  }
`;

const TextProperties = ({ maxLength, pageId, invalid, ...otherProps }) => {
  const [maxChar, setMaxChar] = useState(maxLength);
  const [updateMaxCharacter] = useMutation(UPDATE_ANSWERS_OF_TYPE);

  const handleBlur = () => {
    const actualValue = maxChar === "" ? 2000 : parseInt(maxChar, 10);
    setMaxChar(actualValue);
    updateMaxCharacter({
      variables: {
        input: {
          questionPageId: pageId,
          type: "TextArea",
          properties: {
            maxLength: actualValue,
          },
        },
      },
    });
  };

  return (
    <MaxCharacters
      type="number"
      invalid={invalid}
      value={maxChar}
      id="maxCharInput"
      onBlur={handleBlur}
      onChange={(e) => setMaxChar(e.value)}
      data-test="maxCharacterInput"
      {...otherProps}
    />
  );
};

TextProperties.propTypes = {
  maxLength: PropTypes.number.isRequired,
  pageId: PropTypes.string.isRequired,
  invalid: PropTypes.bool.isRequired,
};

export default TextProperties;
