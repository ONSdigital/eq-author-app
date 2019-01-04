import React from "react";
import { shallow } from "enzyme";
import { ValidationPills } from "App/questionPage/Design/Validation/ValidationPills";
import Duration from "App/questionPage/Design/Validation/Date/Duration";
import { DATE, DATE_RANGE } from "constants/answer-types";
import { CUSTOM, PREVIOUS_ANSWER } from "constants/validation-entity-types";

import DateValidation from "App/questionPage/Design/Validation/Date/DateValidation";

describe("Date Validation", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        properties: {
          format: "dd/mm/yyyy"
        },
        type: DATE
      },
      date: {
        id: "123",
        enabled: true,
        customDate: "2018-01-01",
        offset: {
          value: 5,
          unit: "Months"
        },
        relativePosition: "Before",
        entityType: CUSTOM
      },
      onToggleValidationRule: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      displayName: "Some date",
      readKey: "earliestDate",
      testId: "example-test-id"
    };
  });

  it("should render disabled message when not enabled", () => {
    props.date.enabled = false;
    const wrapper = shallow(<DateValidation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the form input with the values when enabled", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render previous answer, metadata, custom and now for date type answer", () => {
    const answer = {
      ...props.answer,
      type: DATE
    };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    expect(wrapper.find(ValidationPills)).toMatchSnapshot();
  });

  it("should render metadata and custom for date range type answer", () => {
    const answer = {
      ...props.answer,
      type: DATE_RANGE
    };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    expect(wrapper.find(ValidationPills)).toMatchSnapshot();
  });

  it("should call onToggleValidationRule when enabled/disabled", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    wrapper.find("ValidationView").simulate("toggleChange", { value: true });
    expect(props.onToggleValidationRule).toHaveBeenCalledWith({
      id: "123",
      enabled: true
    });
  });

  it("should trigger update answer validation when the duration value changes", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    const duration = wrapper.find(Duration);
    duration.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    duration.simulate("update", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should trigger update answer validation when the relative position changes", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    const relativePositionField = wrapper.find(
      '[data-test="relative-position-select"]'
    );
    relativePositionField.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    relativePositionField.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should trigger update answer validation when the custom value changes", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    const Custom = wrapper.find(ValidationPills).prop("Custom");
    let customDateField = shallow(<Custom />);
    customDateField.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    customDateField.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should correctly handle entity type change", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    const pills = wrapper.find(ValidationPills);
    pills.simulate("entityTypeChange", PREVIOUS_ANSWER);
    expect(props.onChange).toHaveBeenCalledWith(
      {
        name: "entityType",
        value: PREVIOUS_ANSWER
      },
      props.onUpdate
    );
  });

  it("should correctly handle previous answer change", () => {
    const previousAnswer = {
      id: 1
    };

    const wrapper = shallow(<DateValidation {...props} />);
    const PreviousAnswer = wrapper.find(ValidationPills).prop("PreviousAnswer");
    shallow(<PreviousAnswer />).simulate("submit", {
      name: "previousAnswer",
      value: previousAnswer
    });
    expect(props.onChange).toHaveBeenCalledWith(
      {
        name: "previousAnswer",
        value: previousAnswer
      },
      props.onUpdate
    );
  });

  it("should correctly handle metadata change", () => {
    const metadata = {
      id: 1
    };

    const wrapper = shallow(<DateValidation {...props} />);
    const Metadata = wrapper.find(ValidationPills).prop("Metadata");
    shallow(<Metadata />).simulate("submit", {
      name: "metadata",
      value: metadata
    });
    expect(props.onChange).toHaveBeenCalledWith(
      {
        name: "metadata",
        value: metadata
      },
      props.onUpdate
    );
  });

  it("should filter the available units for the mm/yyyy", () => {
    const answer = {
      properties: {
        format: "mm/yyyy"
      }
    };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });

  it("should filter the available units for the dd/mm/yyyy", () => {
    const answer = { properties: { format: "dd/mm/yyyy" } };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });

  it("should filter the available units for the yyyy", () => {
    const answer = { properties: { format: "yyyy" } };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });

  it("should render all units for date range answers", () => {
    const answer = {
      properties: {},
      type: DATE_RANGE
    };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });
});
