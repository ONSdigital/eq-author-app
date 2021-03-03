import React from "react";
import { shallow } from "enzyme";
import UnwrappedSkipLogicEditor from "./";

describe("components/SkipConditionSet", () => {
  const defaultProps = {
    pageId: "1",
    skipConditions: [
      {
        id: "2",
        operator: "AND",
        expressions: [{ id: "3" }],
      },
    ],
    onAddSkipConditions: jest.fn(),
  };

  it("should render children", () => {
    const wrapper = shallow(<UnwrappedSkipLogicEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow creating a skip condition", () => {
    const wrapper = shallow(<UnwrappedSkipLogicEditor {...defaultProps} />);
    wrapper.find("[data-test='btn-add-skip-condition']").simulate("click");
    expect(defaultProps.onAddSkipConditions).toHaveBeenCalledTimes(1);
  });
});
