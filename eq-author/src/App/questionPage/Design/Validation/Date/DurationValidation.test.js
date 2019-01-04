import React from "react";
import { shallow } from "enzyme";
import Duration from "App/questionPage/Design/Validation/Date/Duration";
import { DATE_RANGE } from "constants/answer-types";

import DurationValidation from "App/questionPage/Design/Validation/Date/DurationValidation";

describe("Duration Validation", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        properties: {
          format: "dd/mm/yyyy"
        },
        type: DATE_RANGE
      },
      duration: {
        id: "123",
        enabled: true,
        duration: {
          value: 5,
          unit: "Months"
        }
      },
      onToggleValidationRule: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      displayName: "Some date",
      testId: "duration-test-id"
    };
  });

  it("should render disabled message when not enabled", () => {
    props.duration.enabled = false;
    const wrapper = shallow(<DurationValidation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the form input with the values when enabled", () => {
    const wrapper = shallow(<DurationValidation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onToggleValidationRule when enabled/disabled", () => {
    const wrapper = shallow(<DurationValidation {...props} />);
    wrapper.find("ValidationView").simulate("toggleChange", { value: true });
    expect(props.onToggleValidationRule).toHaveBeenCalledWith({
      id: "123",
      enabled: true
    });
  });

  it("should trigger update answer validation when the duration value changes", () => {
    const wrapper = shallow(<DurationValidation {...props} />);
    const duration = wrapper.find(Duration);
    duration.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");

    duration.simulate("update", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });
});
