import React from "react";
import { shallow } from "enzyme";
import { UnwrappedSkipLogicEditor } from "./";

describe("components/SkipConditionSet", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      page: {
        id: "1",
        displayName: "Test",
        skipConditions: [
          {
            id: "1",
            expressions: [{ id: "1" }],
          },
        ],
      },
      createSkipCondition: jest.fn(),
    };
  });

  it("should render children", () => {
    const wrapper = shallow(<UnwrappedSkipLogicEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow creating a skip condition", () => {
    const wrapper = shallow(<UnwrappedSkipLogicEditor {...defaultProps} />);
    wrapper.find("[data-test='btn-add-skip-condition']").simulate("click");
    expect(defaultProps.createSkipCondition).toHaveBeenCalledWith(
      defaultProps.page.id
    );
  });
});
