import React from "react";
import { shallow } from "enzyme";

import AnswerChip from "./AnswerChip";

describe("AnswerChip", () => {
  const onRemove = jest.fn();
  it("should render", () => {
    const wrapper = shallow(<AnswerChip onRemove={onRemove}>Hello</AnswerChip>);
    expect(wrapper).toMatchSnapshot();
  });
  it("should call onRemove on x click", () => {
    const wrapper = shallow(<AnswerChip onRemove={onRemove}>Hello</AnswerChip>);
    wrapper.find("[data-test='remove-answer-button']").simulate("click");
    expect(onRemove).toHaveBeenCalled();
  });
});
