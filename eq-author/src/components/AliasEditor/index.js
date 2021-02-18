import React from "react";
import styled from "styled-components";
import CharacterCounter from "components/CharacterCounter";
import PropTypes from "prop-types";

import { sharedStyles } from "components/Forms/css";
import { colors } from "constants/theme";

export const Wrapper = styled.div`
  ${sharedStyles};
  grid-column-start: 1;
  grid-row-start: 2;
  height: 2.3em;
  display: flex;
  max-width: 22em;
`;

const InputBox = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 1em;
  color: ${colors.black};
`;

const AliasEditor = ({ onChange, onUpdate, alias }) => (
  <Wrapper>
    <InputBox
      id="alias"
      type="text"
      data-test="alias"
      autoComplete="off"
      name="alias"
      placeholder=""
      onChange={(e) => onChange(e.target)}
      onBlur={(e) => onUpdate(e.target)}
      value={alias || ""}
    />
    <CharacterCounter value={alias} limit={24} />
  </Wrapper>
);

AliasEditor.propTypes = {
  alias: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default AliasEditor;
