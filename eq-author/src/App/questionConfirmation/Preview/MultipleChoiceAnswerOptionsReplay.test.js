import { shallow } from "enzyme";
import React from "react";

import MultipleChoiceAnswerOptionsReplay from "./MultipleChoiceAnswerOptionsReplay";

describe("MultipleChoiceAnswerOptionsReplay", () => {
  let options;
  beforeEach(() => {
    options = [
      {
        id: "1",
        label: "label 1",
      },
      {
        id: "2",
        label: "label 2",
      },
    ];
  });

  it("should render", () => {
    const wrapper = shallow(
      <MultipleChoiceAnswerOptionsReplay options={options} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
