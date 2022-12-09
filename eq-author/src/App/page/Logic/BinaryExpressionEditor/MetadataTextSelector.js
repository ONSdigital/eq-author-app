import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius } from "constants/theme.js";

import WrappingInput from "components/Forms/WrappingInput";

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

const MetadataTextSelector = ({ expression }) => {
  return (
    <RoutingSelectorContainer>
      <p>{expression.condition}</p>
      <WrappingInput
        id="metadata-match-input"
        name="label"
        data-test="metadata-match-input"
        // onChange={onChange}
        // onBlur={onUpdate}
      />
    </RoutingSelectorContainer>
  );
};

export default MetadataTextSelector;
