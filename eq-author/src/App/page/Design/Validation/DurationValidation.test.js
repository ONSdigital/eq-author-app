import React from "react";
import { shallow } from "enzyme";
import Duration from "./Duration";
import { DATE_RANGE } from "constants/answer-types";

import DurationValidation from "./DurationValidation";

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
          value: 5,
          unit: "Months",
        },
      },
      onToggleValidationRule: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      displayName: "Some date",
      testId: "duration-test-id",
      hasError: false,
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
});
