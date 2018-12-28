import React from "react";
import { shallow } from "enzyme";

import { AnswerContentPicker } from "App/components/ContentPicker";

describe("Answer Content Picker", () => {
  it("should render a configured ContentPicker", () => {
    expect(shallow(<AnswerContentPicker data={[]} />)).toMatchSnapshot();
  });
});
