import React from "react";
import { shallow } from "enzyme";

import { MaxValue } from "components/Validation/MaxValue";
import { ValidationPills } from "components/Validation/ValidationPills";

import { CUSTOM, PREVIOUS_ANSWER } from "constants/validation-entity-types";
import { NUMBER } from "constants/answer-types";

const createWrapper = (props, render = shallow) =>
  render(<MaxValue {...props} />);

describe("MaxValue", () => {
  let props, wrapper, onUpdateAnswerValidation, onToggleValidationRule;
  beforeEach(() => {
    onUpdateAnswerValidation = jest.fn();
    onToggleValidationRule = jest.fn();

    props = {
      maxValue: {
        id: "1",
        enabled: true,
        custom: 123,
        inclusive: true,
        entityType: CUSTOM,
        previousAnswer: null
      },
      onUpdateAnswerValidation: onUpdateAnswerValidation,
      onToggleValidationRule: onToggleValidationRule,
      limit: 999999999,
      answerType: NUMBER,
      answerId: "1"
    };

    wrapper = createWrapper(props);
  });

  it("should render with content", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render with disabled content", () => {
    props.maxValue.enabled = false;
    expect(createWrapper(props)).toMatchSnapshot();
  });

  it("should correctly handle toggle change", () => {
    wrapper.simulate("toggleChange", { value: false });

    expect(onToggleValidationRule).toHaveBeenCalledWith({
      id: props.maxValue.id,
      enabled: false
    });
  });

  it("should correctly handle include change", () => {
    wrapper.find("#max-value-include").simulate("change", { value: false });

    expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
      id: props.maxValue.id,
      maxValueInput: {
        custom: props.maxValue.custom,
        inclusive: false
      }
    });
  });

  it("should correctly handle entity type change", () => {
    wrapper.find(ValidationPills).simulate("entityTypeChange", PREVIOUS_ANSWER);

    expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
      id: props.maxValue.id,
      maxValueInput: {
        inclusive: props.maxValue.inclusive,
        entityType: PREVIOUS_ANSWER,
        previousAnswer: null,
        custom: null
      }
    });
  });

  it("should correctly handle previous answer", () => {
    const previousAnswer = {
      id: 1
    };
    const PreviousAnswer = wrapper.find(ValidationPills).prop("PreviousAnswer");
    shallow(<PreviousAnswer />).simulate("submit", {
      name: "previousAnswer",
      value: previousAnswer
    });

    expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
      id: props.maxValue.id,
      maxValueInput: {
        inclusive: props.maxValue.inclusive,
        previousAnswer: previousAnswer.id
      }
    });
  });

  describe("Custom Input", () => {
    let CustomInput, customInputWrapper;

    beforeEach(() => {
      CustomInput = wrapper.find(ValidationPills).prop("Custom");
      customInputWrapper = shallow(<CustomInput />);
    });

    it("should correctly handle max value changes with in range values", () => {
      customInputWrapper.simulate("change", {
        value: 1
      });

      expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
        id: props.maxValue.id,
        maxValueInput: {
          inclusive: props.maxValue.inclusive,
          custom: 1
        }
      });
    });

    it("should correctly handle max value change with empty string", () => {
      customInputWrapper.simulate("change", { value: "" });

      expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
        id: props.maxValue.id,
        maxValueInput: {
          inclusive: props.maxValue.inclusive,
          custom: null
        }
      });
    });

    it("should correctly coerce string inputs to integers", () => {
      customInputWrapper.simulate("change", { value: "1" });

      expect(onUpdateAnswerValidation).toHaveBeenCalledWith({
        id: props.maxValue.id,
        maxValueInput: {
          inclusive: props.maxValue.inclusive,
          custom: 1
        }
      });
    });

    it("should correctly handle max value change with out of range values", () => {
      customInputWrapper.simulate("change", { value: 1000000000 });
      expect(onUpdateAnswerValidation).not.toHaveBeenCalled();

      customInputWrapper.simulate("change", { value: -1000000000 });
      expect(onUpdateAnswerValidation).not.toHaveBeenCalled();

      customInputWrapper.simulate("change", { value: 999999999 });
      expect(onUpdateAnswerValidation).toHaveBeenCalled();

      customInputWrapper.simulate("change", { value: -999999999 });
      expect(onUpdateAnswerValidation).toHaveBeenCalled();
    });
  });
});
