import React from "react";
import styled from "styled-components";
import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const Paragraph = styled.p``;

const RepeatLabelAndInput = () => {
  const repeatLabelAndInput = null;
  return (
    <>
      <ToggleWrapper>
        <InlineField
          id="repeat-label-and-input"
          htmlFor="repeat-label-and-input"
          label="Repeat label and input"
        >
          <Paragraph>
            <br />
            Repeat this label and input for each answer added to the linked
            collection list. Each answer will be piped into a separate label.
          </Paragraph>
        </InlineField>
        <InlineField
          id="repeat-label-and-input"
          htmlFor="repeat-label-and-input"
          label=""
        >
          <ToggleSwitch
            id="repeat-label-and-input-toggle"
            name="repeat-label-and-input-toggle"
            hideLabels={false}
            onChange={() => {}}
            data-test="repeat-label-and-input-toggle"
            checked={repeatLabelAndInput || false}
          />
        </InlineField>
      </ToggleWrapper>
    </>
  );
};

export default RepeatLabelAndInput;
