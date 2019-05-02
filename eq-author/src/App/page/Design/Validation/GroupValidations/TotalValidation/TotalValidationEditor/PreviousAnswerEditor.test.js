import React from "react";
import { shallow } from "enzyme";

import PreviousAnswerEditor from "./PreviousAnswerEditor";

describe("Custom Editor", () => {
  let props;
  beforeEach(() => {
    props = {
      total: {
        id: "1",
        previousAnswer: {
          displayName: "My answer",
        },
      },
      onChangeUpdate: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<PreviousAnswerEditor {...props} />)).toMatchSnapshot();
  });

  it("should trigger onChange when the number input changes", () => {
    const wrapper = shallow(<PreviousAnswerEditor {...props} />);
    wrapper
      .find("[data-test='content-picker-select']")
      .simulate("submit", { name: "previousAnswer", value: { id: "1" } });
    expect(props.onChangeUpdate).toHaveBeenCalledWith({
      name: "previousAnswer",
      value: { id: "1" },
    });
  });
});
