import React from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { colors, radius } from "constants/theme.js";

import WrappingInput from "components/Forms/WrappingInput";

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
  const rightSideText = expression?.right?.text;
  const [updateRightSide] = useMutation(UPDATE_RIGHT_SIDE);

  return (
    <RoutingSelectorContainer>
      <ConditionContent>{expression.condition}</ConditionContent>
      <WrappingInput
        id="metadata-match-input"
        name="label"
        data-test="metadata-match-input"
        value={rightSideText}
        onChange={({ value }) =>
          updateRightSide({
            variables: {
              input: {
                expressionId: expression.id,
                customValue: { text: value },
              },
            },
          })
        }
      />
    </RoutingSelectorContainer>
  );
};

export default MetadataTextSelector;
