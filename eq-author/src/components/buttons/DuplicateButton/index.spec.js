import React from "react";
import { shallow } from "enzyme";
import { render } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import DuplicateButton from ".";

describe("Duplicate Button", () => {
  let props;
  beforeEach(() => {
    props = {
      onClick: jest.fn(),
      "data-test": "foo",
      withText: true,
    };
  });
  it("should render", () => {
    const wrapper = shallow(<DuplicateButton {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call on click when clicked", () => {
    const wrapper = shallow(<DuplicateButton {...props} />);
    wrapper.find("[data-test='foo']").simulate("click", "hello");
    expect(props.onClick).toHaveBeenCalledWith("hello");
  });

  it("should render without duplicate text when asked to", () => {
    const wrapper = shallow(<DuplicateButton {...props} withText={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should immediately disable the button on click if disableOnClick is set", () => {
    const { getByRole } = render(<DuplicateButton {...props} />);
    const button = getByRole("button");
    userEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("should not disable the button on click if disableOnClick is falsy", () => {
    const { getByRole } = render(
      <DuplicateButton {...props} disableOnClick={false} />
    );
    const button = getByRole("button");
    userEvent.click(button);
    expect(button).not.toBeDisabled();
  });
});
