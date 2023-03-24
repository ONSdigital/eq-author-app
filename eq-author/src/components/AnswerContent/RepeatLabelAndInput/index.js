import React, { useState } from "react";
import styled from "styled-components";
import InlineField from "components/AnswerContent/Format/InlineField";
import ToggleSwitch from "components/buttons/ToggleSwitch";

import { Label } from "components/Forms";

const ToggleWrapper = styled.div`
  margin: 0.7em 0 0 0;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const Paragraph = styled.p`
  margin: 0;
`;

const StyledInlineField = styled(InlineField)`
  padding: 0;
  margin: 0;
`;

const StyledToggleSwitch = styled(ToggleSwitch)`
  margin: 0;
`;

const RepeatLabelAndInput = () => {
  const [toggleStatus, setToggleStatus] = useState(false);

  const handleChange = () => {
    setToggleStatus((prevToggleStatus) => !prevToggleStatus);
  };

  return (
    <>
      <ToggleWrapper>
        <Label>Repeat label and input</Label>
        <Paragraph>
          Repeat this label and input for each answer added to the linked
          collection list. Each answer will be piped into a separate label.
        </Paragraph>

        <StyledInlineField
          id="repeat-label-and-input"
          htmlFor="repeat-label-and-input"
          label=""
        >
          <StyledToggleSwitch
            id="repeat-label-and-input-toggle"
            name="repeat-label-and-input-toggle"
            hideLabels={false}
            onChange={handleChange}
            data-test="repeat-label-and-input-toggle"
            checked={toggleStatus}
            blockDisplay
          />
        </StyledInlineField>
      </ToggleWrapper>
      {toggleStatus && (
        <>
          <Label>Linked collection list</Label>
        </>
      )}
    </>
  );
};

export default RepeatLabelAndInput;
