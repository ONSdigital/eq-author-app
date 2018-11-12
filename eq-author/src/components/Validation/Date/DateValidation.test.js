import { ValidationPills } from "components/Validation/ValidationPills";
import { CUSTOM, PREVIOUS_ANSWER } from "constants/validation-entity-types";
import React from "react";
import { shallow } from "enzyme";
import { Number } from "components/Forms";

import DateValidation from "./DateValidation";

describe("Date Validation", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        properties: {
          format: "dd/mm/yyyy"
        }
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
      testId: "example-test-id",
      displayName: "Some date"
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

  it("should call onToggleValidationRule when enabled/disabled", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    wrapper.find("ValidationView").simulate("toggleChange", { value: true });
    expect(props.onToggleValidationRule).toHaveBeenCalledWith({
      id: "123",
      enabled: true
    });
  });

  it("should trigger update answer validation when the offset value changes", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    const updateValueField = wrapper.find(Number);
    updateValueField.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    updateValueField.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should trigger update answer validation when the offset unit changes", () => {
    const wrapper = shallow(<DateValidation {...props} />);
    const updateUnitField = wrapper.find('[data-test="offset-unit-select"]');
    updateUnitField.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    updateUnitField.simulate("blur", "event");
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

  it("should filter the available units for the format", () => {
    const answer = {
      properties: {
        format: "mm/yyyy"
      }
    };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    const updateUnitField = wrapper.find('[data-test="offset-unit-select"]');
    expect(updateUnitField).toMatchSnapshot();
  });

  it("should render a please select for offset unit when the offset unit is not available for the format", () => {
    const answer = {
      properties: {
        format: "yyyy"
      }
    };
    const wrapper = shallow(<DateValidation {...props} answer={answer} />);
    const updateUnitField = wrapper.find('[data-test="offset-unit-select"]');
    expect(updateUnitField).toMatchSnapshot();
  });
});
