import ValidationInput from "App/questionPage/Design/Validation/ValidationInput";
import React from "react";
import { shallow } from "enzyme";

import FieldWithInclude from "./FieldWithInclude";
import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";
import { UnwrappedMaxValueValidation } from "./MaxValueValidation";
import { ValidationPills } from "./ValidationPills";
import { CUSTOM } from "constants/validation-entity-types";

const createWrapper = (props, render = shallow) =>
  render(<UnwrappedMaxValueValidation {...props} />);

describe("MaxValueValidation", () => {
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
        inclusive: true,
        entityType: CUSTOM,
        previousAnswer: null
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

  describe("Previous Answer", () => {
    let PreviousAnswer, previousAnswerWrapper;

    beforeEach(() => {
      PreviousAnswer = wrapper.find(ValidationPills).prop("PreviousAnswer");
      previousAnswerWrapper = shallow(<PreviousAnswer />);
    });

    it("should correctly handle previous answer change", () => {
      const previousAnswer = {
        id: 1
      };
      previousAnswerWrapper
        .find(PreviousAnswerContentPicker)
        .simulate("submit", {
          name: "previousAnswer",
          value: previousAnswer
        });

      expect(onChangeUpdate).toHaveBeenCalledWith({
        name: "previousAnswer",
        value: { id: 1 }
      });
    });

    it("should correctly handle include change", () => {
      let value = "foobar";
      previousAnswerWrapper.find(FieldWithInclude).simulate("change", value);
      expect(onChangeUpdate).toHaveBeenCalledWith(value);
    });
  });

  describe("Custom Answer", () => {
    let CustomInput, customInputWrapper;

    beforeEach(() => {
      CustomInput = wrapper.find(ValidationPills).prop("Custom");
      customInputWrapper = shallow(<CustomInput />);
    });

    it("should correctly handle custom value changes", () => {
      customInputWrapper.find(ValidationInput).simulate("change", {
        value: 1
      });

      expect(onCustomNumberValueChange).toHaveBeenCalledWith({ value: 1 });
    });

    it("should correctly handle include change", () => {
      let value = "foobar";
      customInputWrapper.find(FieldWithInclude).simulate("change", value);
      expect(onChangeUpdate).toHaveBeenCalledWith(value);
    });
  });
});
