import ValidationInput from "./ValidationInput";
import React from "react";
import { shallow } from "enzyme";

import FieldWithInclude from "./FieldWithInclude";
import { UnwrappedMinValueValidation } from "./MinValueValidation";

const createWrapper = (props, render = shallow) =>
  render(<UnwrappedMinValueValidation {...props} />);

describe("MinValueValidation", () => {
  let props, wrapper;
  let onCustomNumberValueChange = jest.fn();
  let onChangeUpdate = jest.fn();
  let onChange = jest.fn();
  let onUpdate = jest.fn();

  beforeEach(() => {
    props = {
      validation: {
        id: "1",
        enabled: true,
        custom: 123,
        inclusive: true
      },
      answer: {
        id: "1",
        properties: {
          format: "YYYY"
        }
      },
      onCustomNumberValueChange: onCustomNumberValueChange,
      onChangeUpdate: onChangeUpdate,
      onChange: onChange,
      onUpdate: onUpdate,
      displayName: "foobar",
      readKey: "read",
      testId: "test-id"
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly handle include change", () => {
    wrapper.find(FieldWithInclude).simulate("change", { value: false });

    expect(onChangeUpdate).toHaveBeenCalledWith({
      value: false
    });
  });

  it("should correctly handle custom value changes", () => {
    wrapper.find(ValidationInput).simulate("change", {
      value: 1
    });

    expect(onCustomNumberValueChange).toHaveBeenCalledWith({ value: 1 });
  });
});
