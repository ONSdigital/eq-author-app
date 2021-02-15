import React from "react";
import { shallow, mount } from "enzyme";
import Duration from "./Duration";
import { DATE_RANGE } from "constants/answer-types";

import DurationValidation from "./DurationValidation";
import { ERR_NO_VALUE } from "constants/validationMessages";

const createWrapper = (props, render = shallow) =>
  render(<DurationValidation {...props} />);

describe("Duration Validation", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        properties: {
          format: "dd/mm/yyyy",
        },
        type: DATE_RANGE,
      },
      validation: {
        id: "123",
        enabled: true,
        duration: {
          value: null,
          unit: "Months",
        },
        validationErrorInfo: {
          errors: [
            {
              errorCode: "ERR_NO_VALUE",
              field: "minDuration",
              id: "0efd3ed1-8e0d-4b0c-9e39-59010751dbdf",
              type: "validation",
            },
          ],
        },
      },
      onToggleValidationRule: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      displayName: "Some date",
      testId: "duration-test-id",
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should trigger update answer validation when the duration value changes", () => {
    const duration = wrapper.find(Duration);
    duration.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");

    duration.simulate("update", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should display validation message when error present", () => {
    const wrapper = shallow(<DurationValidation {...props} />).find(
      "DurationValidation__StyledError"
    );
    expect(wrapper.text()).toEqual(ERR_NO_VALUE);
  });

  it("should display error styling when error present", () => {
    const wrapper = mount(<DurationValidation {...props} />).find(
      "Duration__DurationNumber"
    );

    expect(wrapper).toHaveStyleRule("border-radius: 4px;");
  });
});
