import React from "react";
import { shallow } from "enzyme";

import CustomEditor from "./CustomEditor";

describe("Custom Editor", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      validation: {
        customDate: null,
        validationErrorInfo: {
          errors: [],
        },
      },
    };

    wrapper = shallow(<CustomEditor {...props} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should trigger update answer validation when the custom value changes", () => {
    const customDateField = wrapper.find("[data-test='custom-date-input']");
    customDateField.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    customDateField.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should not display validation error in the modal when there are no errors", () => {
    const validationMessage = wrapper.find("[data-test='date-required-error']");
    expect(validationMessage.exists()).toBeFalsy();
  });

  it("should display validation error in the modal when there is an error", () => {
    const props = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      validation: {
        validationErrorInfo: {
          errors: [{ id: "1", errorCode: "ERR_NO_VALUE" }],
        },
      },
    };
    wrapper = shallow(<CustomEditor {...props} />);
    const validationMessage = wrapper.find("[data-test='date-required-error']");
    expect(validationMessage.exists()).toBeTruthy();
  });

  it("should only display validation errors with the error code `ERR_NO_VALUE`", () => {
    const props = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      validation: {
        validationErrorInfo: {
          errors: [{ id: "1", errorCode: "NOT_ERR_NO_VALUE" }],
        },
      },
    };
    wrapper = shallow(<CustomEditor {...props} />);
    const validationMessage = wrapper.find("[data-test='date-required-error']");
    expect(validationMessage.exists()).toBeFalsy();
  });
});
