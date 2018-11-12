import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import SplitButton from "components/SplitButton";
import Dropdown from "components/SplitButton/Dropdown";
import MenuItem from "components/SplitButton/MenuItem";
import uncontrollable from "uncontrollable";
import { action } from "@storybook/addon-actions";

const Wrapper = styled.div`
  padding: 1em;
  width: 25em;
`;

const UncontrolledSplitButton = uncontrollable(SplitButton, {
  open: "onToggleOpen"
});

storiesOf("SplitButton", module).add("Default", () => (
  <Wrapper>
    <UncontrolledSplitButton
      onPrimaryAction={action("Primary action")}
      primaryText="Add checkbox"
    >
      <Dropdown>
        <MenuItem onClick={action("Secondary action")}>
          Checkbox (other option)
        </MenuItem>
        <MenuItem onClick={action("Tertiary action")}>
          Checkbox (mutually exclusive)
        </MenuItem>
      </Dropdown>
    </UncontrolledSplitButton>
  </Wrapper>
));
