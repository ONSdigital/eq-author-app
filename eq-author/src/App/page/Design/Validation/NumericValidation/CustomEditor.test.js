import React from "react";
import { shallow } from "enzyme";

import { ValidationPills } from "../ValidationPills";
import { Number } from "components/Forms";
import CustomEditor from "./CustomEditor";
import { NUMBER } from "constants/answer-types";
import { UnwrappedNumericValidation } from "../NumericValidation";

import AnswerValidation, {
} from "../AnswerValidation";
import { ERR_NO_VALUE } from "constants/validationMessages";
import FieldWithInclude from "../FieldWithInclude";

const render = (props, render = shallow) => {
  return render(<AnswerValidation {...props} />);
};

const createWrapper = (props, render = shallow) =>
  render(<UnwrappedNumericValidation {...props} />);

describe("Custom Editor", () => {
  let props, wrapper;
  let onCustomNumberValueChange = jest.fn();
  let onChangeUpdate = jest.fn();
  let onChange = jest.fn();
  let onUpdate = jest.fn();
  let CustomInput, customInputWrapper;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: NUMBER,
        properties: {
          unit: null,
        },
        validation: {
          minValue: {
            enabled: false,
            validationErrorInfo: { errors: [] },
          },
          maxValue: {
            enabled: false,
            validationErrorInfo: { errors: [] },
          },
        },
      },
      validation: {
        custom: null,
        enabled: true,
        entityType: "Custom",
        id: "0efd3ed1-8e0d-4b0c-9e39-59010751dbdf",
        inclusive: true,
        previousAnswer: null,
        validationErrorInfo: {
          errors: [
            {
              errorCode: "ERR_NO_VALUE",
              field: "custom",
              id: "minValue-0efd3ed1-8e0d-4b0c-9e39-59010751dbdf-custom",
              type: "validation",
            }
          ]
        },
      },
      onCustomNumberValueChange: onCustomNumberValueChange,
      onChangeUpdate: onChangeUpdate,
      onChange: onChange,
      onUpdate: onUpdate,
      displayName: "foobar",
      readKey: "read",
      testId: "test-id",
      limit: 999,
    };
    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(shallow(<CustomEditor {...props} />)).toMatchSnapshot();
  });

  it("should trigger onChange when the number input changes", () => {
    const wrapper = shallow(<CustomEditor {...props} />);
    wrapper
      .find("[data-test='numeric-value-input']")
      .simulate("change", { name: "custom", value: 10 });
    expect(props.onChange).toHaveBeenCalledWith({ name: "custom", value: 10 });
  });

  it("should trigger onUpdate when the number input is blurred", () => {
    const wrapper = shallow(<CustomEditor {...props} />);
    wrapper
      .find("[data-test='numeric-value-input']")
      .simulate("blur");
    expect(props.onUpdate).toHaveBeenCalled();
  });

  it("should display validation message when error present", () => {
    const wrapper = shallow(<CustomEditor {...props} />).find(
      "CustomEditor__StyledError"
    );

    expect(wrapper.text()).toEqual(ERR_NO_VALUE);
  });

  // it("should display error styling when error present", () => {
  //   const wrapper = mount(<CustomEditor {...props} />).find(
  //     "CustomEditor__LargerNumber"
  //   );

  //   expect(wrapper).toHaveStyleRule("border-radius: 4px;");
  // });



  beforeEach(() => {
    CustomInput = wrapper.find(ValidationPills).prop("Custom");
    customInputWrapper = shallow(<CustomInput />);
  });

  it("should correctly handle custom value changes", () => {
    let value = 1;
    customInputWrapper.find(Number).simulate("change", value);

    expect(onCustomNumberValueChange).toHaveBeenCalledWith({ value: 1 });
  });

  it("should correctly handle include change", () => {
    let value = "foobar";
    customInputWrapper.find(FieldWithInclude).simulate("change", value);
    expect(onChangeUpdate).toHaveBeenCalledWith(value);
  });
});
