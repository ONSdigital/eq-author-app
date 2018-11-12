import React from "react";
import { storiesOf } from "@storybook/react";
import Typeahead from "components/Typeahead";
import TypeaheadMenu from "./TypeaheadMenu";

import styled from "styled-components";
import { action } from "@storybook/addon-actions";

import { Label } from "components/Forms";
import { UncontrolledInput as Input } from "components/Forms/Input";

const Wrapper = styled.div`
  position: absolute;
  padding: 2em;
`;

const Decorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

const items = [
  { value: "apple" },
  { value: "pear" },
  { value: "orange" },
  { value: "grape" },
  { value: "banana" },
  { value: "kiwi" },
  { value: "mango" },
  { value: "lime" },
  { value: "lemon" },
  { value: "starfruit" },
  { value: "melon" },
  { value: "strawberry" },
  { value: "raspberry" },
  { value: "blackberry" }
];

storiesOf("Typeahead", module)
  .addDecorator(Decorator)
  .add("Default", () => (
    <Typeahead onChange={action("change")}>
      {({ getInputProps, getLabelProps, isOpen, openMenu, ...otherProps }) => (
        <div>
          <Label {...getLabelProps()}>Enter a fruit</Label>
          <Input {...getInputProps({ onFocus: openMenu })} />
          {isOpen && <TypeaheadMenu items={items} {...otherProps} />}
        </div>
      )}
    </Typeahead>
  ));
