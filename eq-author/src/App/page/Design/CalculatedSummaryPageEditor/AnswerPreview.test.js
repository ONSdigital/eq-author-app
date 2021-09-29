import React from "react";
import { shallow } from "enzyme";

import AnswerPreview from "./AnswerPreview";

describe("Answer preview", () => {
  const onRemove = jest.fn();
  it("should render", () => {
    const wrapper = shallow(
      <AnswerPreview onRemove={onRemove}>Hello</AnswerPreview>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("should call onRemove on x click", () => {
    const wrapper = shallow(
      <AnswerPreview onRemove={onRemove}>Hello</AnswerPreview>
    );
    wrapper.find("[data-test='remove-answer-button']").simulate("click");
    expect(onRemove).toHaveBeenCalled();
  });
});
