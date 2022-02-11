import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import CharacterCounter from "components/CharacterCounter";
import { sharedStyles } from "components/Forms/css";
import { colors } from "constants/theme";
import { Label } from "components/Forms";

const Wrapper = styled.div`
  ${sharedStyles};
  grid-column-start: 1;
  grid-row-start: 2;
  height: 2.3em;
  display: flex;
  max-width: 22em;
`;

const ShortCodeTitle = styled(Label)`
  margin-bottom: 0;
  align-self: center;
`;

const InputBox = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 1em;
  color: ${colors.black};
`;

const ShortCodeEditor = ({ shortCode: shortCodeFromDb, onUpdate }) => {
  const [shortCode, setShortCode] = useState(shortCodeFromDb);

  return (
    <>
      <ShortCodeTitle htmlFor="alias">Short code</ShortCodeTitle>
      <Wrapper>
        <InputBox
          id="alias"
          type="text"
          data-test="shortCode"
          autoComplete="off"
          name="shortCode"
          placeholder=""
          onChange={(e) => setShortCode(e.target.value)}
          onBlur={(e) => onUpdate(e.target.value)}
          value={shortCode || ""}
        />
        <CharacterCounter value={shortCode} limit={24} />
      </Wrapper>
    </>
  );
};

ShortCodeEditor.propTypes = {
  shortCode: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};

export default ShortCodeEditor;
