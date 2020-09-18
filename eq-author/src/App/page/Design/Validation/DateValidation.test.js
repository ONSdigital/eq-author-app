import React from "react";
import { shallow } from "enzyme";
import { ValidationPills } from "./ValidationPills";
import { UnwrappedDateValidation } from "./DateValidation";
import Duration from "./Duration";
import { DATE, DATE_RANGE } from "constants/answer-types";
import { CUSTOM } from "constants/validation-entity-types";
import { byTestAttr } from "tests/utils/selectors";

const createWrapper = (props, render = shallow) =>
  render(<UnwrappedDateValidation {...props} />);

describe("Date Validation", () => {
  let props, wrapper;
  let onCustomNumberValueChange = jest.fn();
  let onChangeUpdate = jest.fn();
  let onChange = jest.fn();
  let onUpdate = jest.fn();
  let onToggleValidationRule = jest.fn();

  beforeEach(() => {
    props = {
      validation: {
        id: "123",
        enabled: true,
        customDate: "2018-01-01",
        offset: {
          value: 5,
          unit: "Months",
        },
        relativePosition: "Before",
        entityType: CUSTOM,
        validationErrorInfo: {
          errors: [
            {
              errorCode: "ERR_NO_VALUE",
              field: "custom",
              id: "0efd3ed1-8e0d-4b0c-9e39-59010751dbdf",
              type: "validation",
            }
          ]
        },
      },
      answer: {
        id: "1",
        type: DATE,
        properties: {
          format: "YYYY",
        },
      },
      onCustomNumberValueChange: onCustomNumberValueChange,
      onChangeUpdate: onChangeUpdate,
      onChange: onChange,
      onUpdate: onUpdate,
      onToggleValidationRule: onToggleValidationRule,
      displayName: "foobar",
      readKey: "read",
      testId: "test-id",
      hasError: false,
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render previous answer, metadata, custom and now for date type answer", () => {
    const answer = {
      ...props.answer,
      type: DATE,
    };
    const wrapper = createWrapper({ ...props, answer });
    expect(wrapper.find(ValidationPills)).toMatchSnapshot();
  });

  it("should render metadata and custom for date range type answer", () => {
    const answer = {
      ...props.answer,
      type: DATE_RANGE,
    };
    const wrapper = createWrapper({ ...props, answer });
    expect(wrapper.find(ValidationPills)).toMatchSnapshot();
  });

  it("should trigger update answer validation when the duration value changes", () => {
    const duration = wrapper.find(Duration);
    duration.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    duration.simulate("update", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should trigger update answer validation when the relative position changes", () => {
    const relativePositionField = wrapper.find(
      byTestAttr("relative-position-select")
    );
    relativePositionField.simulate("change", "event");
    expect(onChange).toHaveBeenCalledWith("event");
    relativePositionField.simulate("blur", "event");
    expect(onUpdate).toHaveBeenCalledWith("event");
  });

  it("should trigger update answer validation when the custom value changes", () => {
    const Custom = wrapper.find(ValidationPills).prop("Custom");
    let customDateField = shallow(<Custom />);
    customDateField.simulate("change", "event");
    expect(onChange).toHaveBeenCalledWith("event");
    customDateField.simulate("blur", "event");
    expect(onUpdate).toHaveBeenCalledWith("event");
  });

  it("should correctly handle previous answer", () => {
    const previousAnswer = {
      id: 1,
    };
    const PreviousAnswer = wrapper.find(ValidationPills).prop("PreviousAnswer");
    shallow(<PreviousAnswer />).simulate("submit", {
      name: "previousAnswer",
      value: previousAnswer,
    });

    expect(onChangeUpdate).toHaveBeenCalledWith({
      name: "previousAnswer",
      value: { id: 1 },
    });
  });

  it("should correctly handle metadata change", () => {
    const metadata = {
      id: 1,
    };

    const Metadata = wrapper.find(ValidationPills).prop("Metadata");
    shallow(<Metadata />).simulate("submit", {
      name: "metadata",
      value: metadata,
    });
    expect(props.onChangeUpdate).toHaveBeenCalledWith({
      name: "metadata",
      value: metadata,
    });
  });

  it("should correctly render 'now' entity type", () => {
    const Now = wrapper.find(ValidationPills).prop("Now");
    expect(shallow(<Now />)).toMatchSnapshot();
  });

  it("should filter the available units for the mm/yyyy", () => {
    const answer = {
      ...props.answer,
      properties: {
        format: "mm/yyyy",
      },
    };
    const wrapper = createWrapper({ ...props, answer });
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });

  it("should filter the available units for the dd/mm/yyyy", () => {
    const answer = {
      ...props.answer,
      properties: {
        format: "dd/mm/yyyy",
      },
    };
    const wrapper = createWrapper({ ...props, answer });
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });

  it("should filter the available units for the yyyy", () => {
    const answer = {
      ...props.answer,
      properties: {
        format: "yyyy",
      },
    };
    const wrapper = createWrapper({ ...props, answer });
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });

  it("should render all units for date range answers", () => {
    const answer = {
      ...props.answer,
      type: DATE_RANGE,
    };
    const wrapper = createWrapper({ ...props, answer });
    const duration = wrapper.find(Duration);
    expect(duration.prop("units")).toMatchSnapshot();
  });
});
