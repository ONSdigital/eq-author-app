import React from "react";
import { shallow } from "enzyme";

import { AnswerContentPicker } from "./index";

describe("Answer Content Picker", () => {
  it("should render a configured ContentPicker", () => {
    expect(shallow(<AnswerContentPicker data={[]} />)).toMatchSnapshot();
  });
});
