import React from "react";
import { shallow } from "enzyme";

import Validation from "./Validation";

const createWrapper = (props, render = shallow) =>
  render(<Validation {...props} />);

describe("Validation", () => {
  let props, wrapper;
  let onToggleValidationRule = jest.fn();

  beforeEach(() => {
    props = {
      testId: "test-id",
      displayName: "display-name",
      validation: {
        id: "666",
        enabled: true,
      },
      onToggleValidationRule: onToggleValidationRule,
      children: () => <div>foobar</div>,
    };

    wrapper = createWrapper(props);
  });

  it("should render with content", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render with disabled content", () => {
    props.validation.enabled = false;
    wrapper = createWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly handle toggle change", () => {
    wrapper.simulate("toggleChange", { value: false });
    expect(onToggleValidationRule).toHaveBeenCalledWith({
      enabled: false,
      id: "666",
    });
  });
});
