import React from "react";
import { shallow } from "enzyme";

import PreviousAnswerEditor from "./PreviousAnswerEditor";
import ValidationError from "components/ValidationError";

describe("TotalValidation: Previous Answer Editor", () => {
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

  const render = () => shallow(<PreviousAnswerEditor {...props} />);

  it("should render", () => {
    expect(render()).toMatchSnapshot();
  });

  it("should trigger onChange when the number input changes", () => {
    const wrapper = render();
    wrapper
      .find("[data-test='content-picker-select']")
      .simulate("submit", { name: "previousAnswer", value: { id: "1" } });
    expect(props.onChangeUpdate).toHaveBeenCalledWith({
      name: "previousAnswer",
      value: { id: "1" },
    });
  });

  it("should display validation errors if set", () => {
    props.errors = [
      {
        id: "err-1",
        errorCode: "ERR_NO_VALUE",
      },
    ];

    const wrapper = render();
    expect(wrapper.find(ValidationError)).toHaveLength(1);
  });
});
