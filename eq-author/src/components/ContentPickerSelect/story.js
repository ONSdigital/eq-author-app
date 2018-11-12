import React from "react";
import styled from "styled-components";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { UnwrappedContentPickerSelect } from "components/ContentPickerSelect";

import { ANSWER, METADATA } from "components/ContentPickerSelect/content-types";

const Wrapper = styled.div`
  position: absolute;
  padding: 2em;
  width: 25em;
`;

const Decorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

const props = {
  match: {
    params: {
      questionnaireId: "1"
    }
  },
  data: {
    questionnaire: {
      id: "1"
    }
  },
  onSubmit: action("submit"),
  name: "previousAnswer"
};

storiesOf("ContentPickerSelect", module)
  .addDecorator(Decorator)
  .add("No content selected", () => (
    <UnwrappedContentPickerSelect
      {...props}
      contentTypes={[ANSWER, METADATA]}
    />
  ))
  .add("Content selected", () => (
    <UnwrappedContentPickerSelect
      {...props}
      selectedContentDisplayName="I am an answer"
      contentTypes={[ANSWER, METADATA]}
    />
  ))
  .add("Content truncated", () => (
    <UnwrappedContentPickerSelect
      {...props}
      selectedContentDisplayName="I am a really really really really long answer"
      contentTypes={[ANSWER, METADATA]}
    />
  ));
