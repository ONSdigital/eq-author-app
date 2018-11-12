import React from "react";
import { shallow } from "enzyme";

import { MinValue } from "components/Validation/MinValue";

import { byTestAttr } from "tests/utils/selectors";

const createWrapper = (props, render = shallow) => {
  return render(<MinValue {...props} />);
};

describe("MinValue", () => {
  let onUpdateAnswerValidation;
  let onToggleValidationRule;
  let props;

  beforeEach(() => {
    onUpdateAnswerValidation = jest.fn();
    onToggleValidationRule = jest.fn();

    props = {
      minValue: {
        id: "1",
        enabled: true,
        custom: true,
        inclusive: true
      },
      onUpdateAnswerValidation: onUpdateAnswerValidation,
      onToggleValidationRule: onToggleValidationRule,
      limit: 999999999
    };
  });

  it("should render with content", () => {
    expect(createWrapper(props)).toMatchSnapshot();
  });

  it("should render with disabled content", () => {
    props.minValue.enabled = false;
    expect(createWrapper(props)).toMatchSnapshot();
  });

  it("should correctly handle toggle change", () => {
    const wrapper = createWrapper(props);
    wrapper.simulate("toggleChange", { value: false });

    expect(onToggleValidationRule).toHaveBeenCalledWith({
      id: props.minValue.id,
      enabled: false
    });
  });

  it("should correctly handle min value changes with in range values", () => {
    const wrapper = createWrapper(props);
    wrapper
      .find(byTestAttr("min-value-input"))
      .simulate("change", { value: "1" });

    expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
      id: props.minValue.id,
      minValueInput: {
        inclusive: props.minValue.inclusive,
        custom: 1
      }
    });
  });

  it("should correctly handle min value change with empty string", () => {
    const wrapper = createWrapper(props);
    wrapper
      .find(byTestAttr("min-value-input"))
      .simulate("change", { value: "" });

    expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
      id: props.minValue.id,
      minValueInput: {
        inclusive: props.minValue.inclusive,
        custom: null
      }
    });
  });

  it("should correctly coerce string inputs to integers", () => {
    const wrapper = createWrapper(props);
    wrapper
      .find(byTestAttr("min-value-input"))
      .simulate("change", { value: "1" });

    expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
      id: props.minValue.id,
      minValueInput: {
        inclusive: props.minValue.inclusive,
        custom: 1
      }
    });
  });

  it("should correctly handle min value change with out of range values", () => {
    const wrapper = createWrapper(props);

    const minValueInput = wrapper.find(byTestAttr("min-value-input"));
    minValueInput.simulate("change", { value: 1000000000 });
    expect(onUpdateAnswerValidation).not.toHaveBeenCalled();

    minValueInput.simulate("change", { value: -1000000000 });
    expect(onUpdateAnswerValidation).not.toHaveBeenCalled();

    minValueInput.simulate("change", { value: 999999999 });
    expect(onUpdateAnswerValidation).toHaveBeenCalled();

    minValueInput.simulate("change", { value: -999999999 });
    expect(onUpdateAnswerValidation).toHaveBeenCalled();
  });

  it("should correctly handle include change", () => {
    const wrapper = createWrapper(props);
    wrapper.find("#min-value-include").simulate("change", { value: false });

    expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
      id: props.minValue.id,
      minValueInput: {
        custom: props.minValue.custom,
        inclusive: false
      }
    });
  });
});
