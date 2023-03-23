import React from "react";
import styled from "styled-components";
import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const Wrapper = styled.div`
  margin-top: 0.7em;
`;

const StyledToggleSwitch = styled(ToggleSwitch)`
  display: inline;
`;

const RepeatLabelAndInput = () => {
  return (
    <Wrapper>
      <InlineField
        id="repeat-label-and-input"
        htmlFor="repeat-label-and-input"
        label="Repeat label and input"
      />
      Repeat this label and input for each answer added to the linked collection
      list. Each answer will be piped into a separate label.
      <StyledToggleSwitch
        id="repeat-label-and-input-toggle"
        name="repeat-label-and-input-toggle"
        hideLabels={false}
        onChange={() => {}}
        data-test="repeat-label-and-input-toggle"
        checked={false}
      />
    </Wrapper>
  );
};

export default RepeatLabelAndInput;
