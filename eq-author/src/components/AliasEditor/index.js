import React from "react";
import styled from "styled-components";
import CharacterCounter from "components/CharacterCounter";
import WrappingInput from "components/Forms/WrappingInput";
import PropTypes from "prop-types";

export const Wrapper = styled.div`
  position: relative;
  max-width: 22em;
  flex: 1 1 auto;
`;

const StyledWrappingInput = styled(WrappingInput)`
  white-space: nowrap;
`;

const AliasEditor = ({ onChange, onUpdate, alias }) => (
  <Wrapper>
    <StyledWrappingInput
      id="alias"
      data-test="alias"
      name="alias"
      placeholder="Shortcode"
      onChange={onChange}
      onBlur={onUpdate}
      value={alias}
      maxLength={255}
      maxRows={1}
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
