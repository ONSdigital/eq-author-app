import React from "react";
import { shallow, mount } from "enzyme";
import Duration, { DurationNumber } from "./Duration";
import { Select } from "components/Forms";

import { DAYS, MONTHS, YEARS } from "constants/durations";
const UNITS = [DAYS, MONTHS, YEARS];

const render = props => shallow(<Duration {...props} />);

describe("Duration", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      name: "foobar",
      duration: {
        value: null,
        unit: YEARS,
      },
      units: UNITS,
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      hasError: {
        _typename: "ValidationError",
        errorCode: "ERR_NO_VALUE",
        field: "earliestDate",
        id: "dcd686db-91e5-453f-b809-9da401072db4",
        type: "validation",
      },
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly change and update duration value", () => {
    const value = wrapper.find(DurationNumber);
    value.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    value.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should correctly change and update duration unit", () => {
    const value = wrapper.find(Select);
    value.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    value.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should display error styling when error present", () => {
    const wrapper = mount(<Duration {...props} />).find(
      "Duration__DurationNumber"
    );
    expect(wrapper).toHaveStyleRule("border-color: #D0021B;");
  });
});
