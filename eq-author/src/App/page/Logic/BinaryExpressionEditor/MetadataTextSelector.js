import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { colors, radius } from "constants/theme.js";
import { rightSideErrors } from "constants/validationMessages";

import WrappingInput from "components/Forms/WrappingInput";
import ValidationError from "components/ValidationError";

import UPDATE_RIGHT_SIDE from "graphql/updateRightSide.graphql";

const RoutingSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.lightGrey};
  margin: 1em 0;
  border-radius: ${radius};
  padding: 1em;
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    outline-color: ${colors.errorPrimary};
    box-shadow: 0 0 0 2px ${colors.errorPrimary};
    border-radius: 4px;
    margin-bottom: 0.5em;
  `}
`;

const ConditionContent = styled.span`
  margin-right: 1em;
`;

const MetadataTextSelector = ({ expression }) => {
  const [updateRightSide] = useMutation(UPDATE_RIGHT_SIDE);
  const [metadataMatchText, updateMetadataMatchText] = useState(
    expression?.right?.text
  );
  const { errors } = expression.validationErrorInfo;
  const hasError = errors.length > 0;

  const handleError = () => {
    let message;

    if (
      errors.some(({ errorCode }) => errorCode === "ERR_RIGHTSIDE_NO_VALUE")
    ) {
      message = rightSideErrors.ERR_RIGHTSIDE_TEXT_NO_VALUE.message;
    }

    return message;
  };
  return (
    <>
      <RoutingSelectorContainer hasError={hasError}>
        <ConditionContent>{expression.condition}</ConditionContent>
        <WrappingInput
          id="metadata-match-input"
          name="label"
          data-test="metadata-match-input"
          value={metadataMatchText}
          onChange={({ value }) => updateMetadataMatchText(value)}
          onBlur={() =>
            updateRightSide({
              variables: {
                input: {
                  expressionId: expression.id,
                  customValue: { text: metadataMatchText },
                },
              },
            })
          }
        />
      </RoutingSelectorContainer>
      {hasError && <ValidationError>{handleError()}</ValidationError>}
    </>
  );
};

export default MetadataTextSelector;
